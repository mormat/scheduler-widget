
class WordpressHelper {
    
    #baseUrl;
    #world;
    
    constructor({ baseUrl, baseFolder, world }) {
        this.#baseUrl = baseUrl;
        this.#world = world;
    }   
        
    async login({username, password}) {
        
        await this.#world.openUrl('/wp-login.php/');
        
        await this.#world.clickOn(`label:contains("Username")`);
        await this.#world.getActiveElement().sendKeys( username );
        
        await this.#world.clickOn(`label:contains("Password")`);
        await this.#world.getActiveElement().sendKeys( password );
        
        await this.#world.clickOn(`input[value="Log In"]`);
        await this.#world.waitForText("Dashboard");
        
    }
    
    async activatePlugin( pluginName ) {
        await this.#world.openUrl( `/wp-admin/` );
        
        await this.#world.clickOn(`a:contains("Plugins")`);
        
        const parent = `td:contains("${pluginName}") `;
        const button = `a:contains("Activate")`;
        
        await this.#world.clickOn(parent + button);
    }
    
    async activateTheme( themeName ) {
        await this.#world.openUrl( `/wp-admin/` );
        
        await this.#world.clickOn(`a:contains("Appearance")`);
        
        const parent = `.theme-id-container:contains("${ themeName }") `;
        const button = `a:contains("Activate")`;
        
        await this.#world.clickOn(parent + button);
    }
        
    async setupWordpress({
        siteTitle = "My Wordpress site",
        username = "admin",
        password = "admin",
        email = "admin@nowhere.com"
    } = {}) {
        await this.#world.openUrl('/index.php');
        await this.#world.clickOn('input[value="Continue"]');
        
        await this.#world.clickOn(`label:contains("Site Title")`);
        await this.#world.getActiveElement().sendKeys(siteTitle);
        
        await this.#world.clickOn(`label:contains("Username")`);
        await this.#world.getActiveElement().sendKeys(username);
        
        await this.#world.clickOn(`label:contains("Password")`);
        const inputPassword = await this.#world.getActiveElement();
        await inputPassword.clear();
        await inputPassword.sendKeys(password);
        
        await this.#world.clickOn(`label:contains("Your Email")`);
        await this.#world.getActiveElement().sendKeys(email);
        
        try {
            await this.#world.clickOn(
                `label:contains("Confirm use of weak password")`
            );    
        } catch {}
     
        await this.#world.clickOn(`input[value="Install WordPress"]`);
        await this.#world.waitForText("Success");
    }
    
}

module.exports = WordpressHelper;
