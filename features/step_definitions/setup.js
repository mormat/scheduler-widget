const { 
    Given,
    BeforeAll
} = require('@cucumber/cucumber');

const path = require('path');
const fs   = require('fs');

const installWordPress = require('@mormat/wordpress-sqlite-installer');

const BASE_FOLDER = path.join(__dirname, '..', '..');
const TEMP_FOLDER = path.join(BASE_FOLDER, 'temp');
const RESOURCES_FOLDER = path.join(BASE_FOLDER, 'features', 'resources');
const WORDPRESS_FOLDER = path.join(TEMP_FOLDER, 'wordpress');
const PLUGIN_NAME = 'scheduler-widget';

BeforeAll(async function() {
    
    if (!fs.existsSync( WORDPRESS_FOLDER )) {
        console.log("downloading WordPress");
        await installWordPress( TEMP_FOLDER );
    }
    
    const pluginFolder = path.join(
        WORDPRESS_FOLDER, 
        'wp-content', 
        'plugins',
        PLUGIN_NAME
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
        const src = path.join(BASE_FOLDER, item);
        const dest = path.join( pluginFolder, item );
        if (!fs.existsSync( dest )) {
            fs.symlinkSync(src, dest);
        }
    }

});

Given('WordPress has been freshly installed', async function () {
    
    fs.cpSync(
        path.join(RESOURCES_FOLDER),
        path.join(TEMP_FOLDER),
        {recursive: true}
    );
    
    this.driver.manage().deleteAllCookies();
    
});
