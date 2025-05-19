const { 
    setDefaultTimeout,
    setWorldConstructor,
    AfterAll
} = require('@cucumber/cucumber');

const { SeleniumWorld } = require('@mormat/test-utils');

setDefaultTimeout( 60 * 1000 );

setWorldConstructor( class extends SeleniumWorld {
    constructor() {
        super({
            baseUrl: 'http://localhost:9001/wordpress'
        });
    }
} );

AfterAll(async function() {
    
    if (!process.argv.includes('--fail-fast')) {
        SeleniumWorld.driver.close();
    }
    
});
