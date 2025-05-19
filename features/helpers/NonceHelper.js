
class NonceHelper {
    
    #world;
    #wordpress;
    
    constructor(world, wordpress) {
        this.#world = world;
        this.#wordpress = wordpress;
    }
    
    async getSecuredHttpHeaders() {   
        
        await this.#wordpress.activatePlugin("Test Nonce Provider");
        
        const nonce = await this.#world.getPageText('.test_nonce_provider_wp_rest');
        
        const cookies = await this.#world.driver.manage().getCookies();
    
        return {
            'X-WP-Nonce': nonce, 
            'cookie': cookies.filter(
                ({name}) => name.startsWith('wordpress_logged_in') || name.startsWith('wordpress_test_cookie')
            ).map(
                ({name, value}) => name + '=' + value
            ).join(';')
        }
        
    }
    
}

module.exports = NonceHelper;
