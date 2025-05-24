const { 
    setDefaultTimeout,
    setWorldConstructor,
    Given,
    BeforeAll,
    Before,
    AfterAll
} = require('@cucumber/cucumber');

const path = require('path');
const fs = require('fs');

const installWordPress = require('@mormat/wordpress-sqlite-installer');

const { SeleniumWorld } = require('@mormat/test-utils');
const RequestsHelper = require('../helpers/RequestsHelper');
const WordpressHelper = require('../helpers/WordpressHelper');

setDefaultTimeout( 60 * 1000 );

const PROJECT_FOLDER   = path.join(__dirname, '..', '..');
const TEMP_FOLDER      = path.join(PROJECT_FOLDER, 'temp');
const WORDPRESS_FOLDER = path.join(TEMP_FOLDER, 'wordpress');
const RESOURCES_FOLDER = path.join(__dirname, '..', 'resources');

const baseUrl = 'http://localhost:9001/wordpress';

setWorldConstructor( class extends SeleniumWorld {
    #helpers;
    
    constructor() {
        super({ baseUrl });
        this.#helpers = {
            'requests': new RequestsHelper({ baseUrl }),
            'wordpress': new WordpressHelper({ 
                baseUrl,
                baseFolder: WORDPRESS_FOLDER,
                world: this
            })
        };
        
    }
    
    get requests() {
        return this.#helpers['requests'];
    }
    
    get wordpress() {
        return this.#helpers['wordpress'];
    }
    
    async hasElement(selector) {
        const elements = await this.findElements(selector);
        return (elements.length > 0);
    }
    
    // Apparently, it takes a little time to get the focus an element when we click on it
    // for some reasons I didn't find out yet
    async waitForActiveElement(expectedElement) {
        let attempts = 0;
        while (attempts++ < 10) {
            const activeElement = await this.getActiveElement();
            if (activeElement === expectedElement) {
                return;
            }
            this.wait(100);
        }
    }
    
    async waitFor(selector, { timeout = 10002 } = {}) {
        
        let   attempts = 0;
        const stepTimeout = 500;
        const limit = Math.round(timeout / stepTimeout);
        
        while ( attempts++ <= limit ) {
            
            try {
                await this.getElement( selector );
                break;
            } catch (error) {
                if ( attempts < limit ) {
                    await this.wait(stepTimeout); 
                } else {
                    throw error;   
                }
            }
            
        }
        
    }
    

    
} );

BeforeAll(async function() {
    
    if (!fs.existsSync( WORDPRESS_FOLDER )) {
        await installWordPress( TEMP_FOLDER );
    }
    
    const pluginFolder = path.join(
        WORDPRESS_FOLDER, 
        'wp-content', 
        'plugins',
        'scheduler-widget'
    )
    if (!fs.existsSync( pluginFolder )) {
        fs.mkdirSync( pluginFolder )
    }
    
    const items = [
        'readme.txt',
        'scheduler-widget.php',
        'build',
        'languages'
    ]
    for (const item of items) {
        const src = path.join(PROJECT_FOLDER, item);
        const dest = path.join( pluginFolder, item );
        if (!fs.existsSync( dest )) {
            fs.symlinkSync(src, dest);
        }
    }
    
    fs.cpSync(
        path.join(RESOURCES_FOLDER),
        path.join(TEMP_FOLDER),
        {recursive: true}
    );

});

Before(async function() {
    await this.driver.manage().deleteAllCookies();
    
    await this.openUrl('/../index.php');
});

Given('Wordpress has been freshly installed', async function () {
    
    const dbFolder = path.join(WORDPRESS_FOLDER, 'wp-content', 'database');
    if (fs.existsSync(dbFolder)) {
        fs.rmSync( dbFolder, {recursive: true} );
    }
    
    const snapshotFolder = path.join(TEMP_FOLDER, 'snapshots', 'database');
    if (fs.existsSync(snapshotFolder)) {
        fs.cpSync( snapshotFolder, dbFolder, {recursive: true} );
    } else {
        await this.wordpress.setupWordpress({
            siteTitle: "Test Environment"
        });
        await this.wordpress.login({username: 'admin', password: 'admin'});
        await this.wordpress.activatePlugin("Scheduler Widget");
        await this.wordpress.activateTheme("Twenty Twenty-Three");
        fs.cpSync( dbFolder, snapshotFolder, {recursive: true} );
    }
    
});

AfterAll(async function() {
    
    if (!process.argv.includes('--fail-fast')) {
        SeleniumWorld.driver.close();
    }
    
});
