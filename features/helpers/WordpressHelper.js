
class WordpressHelper {
    
    #world;
    #baseUrl;
    
    constructor({ baseUrl, world }) {
        this.#baseUrl = baseUrl;
        this.#world = world;
    }   
        
    async login({username, password}) {
        
        await this.#world.openUrl('/wp-login.php/');
        
        const loginButton = `input[value="Log In"]`;
        
        await this.fillValue("Username", username);
        await this.fillValue("Password", password);
        
        await this.#world.clickOn(loginButton);
        await this.#world.waitForText("Dashboard");
                
    }
    
    async activatePlugin( pluginName ) {
        await this.#world.openUrl( `/wp-admin/` );
        
        await this.#world.clickOn(`a:contains("Plugins")`);
        
        const parent = `td:contains("${pluginName}") `;
        const activateButton = `a:contains("Activate")`;
        const deactivateButton = `a:contains("Deactivate")`;
        
        if (await this.#world.hasElement(parent + deactivateButton)) {
            return;
        }
        
        await this.#world.clickOn(parent + activateButton);
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
        
        await this.fillValue("Site Title", siteTitle);
        await this.fillValue("Username", username);
        await this.fillValue("Password", password);
        await this.fillValue("Your Email", email);
        
        try {
            await this.#world.clickOn(
                `label:contains("Confirm use of weak password")`
            );    
        } catch {}
     
        await this.#world.clickOn(`input[value="Install WordPress"]`);
        await this.#world.waitForText("Success");
    }
    
    async addPage(pageTitle) {
        
        const world = this.#world;
        
        await world.openUrl( `/wp-admin/` );
        await world.clickOn(`a:contains("Pages")`);
        await world.clickOn(`#wpbody a:contains("Add Page")`);
        
        // Skip a very annoying popup explaining the usage of the block editor
        // that appears the first time we edit a page.
        try {
            await world.clickOn(`.components-modal__header button`);
        } catch {}
        await world.waitForText("Save draft");
        await world.driver.switchTo().frame(0);
        
        const titleElement = await world.getElement('h1[contenteditable=true]');
        await titleElement.click();
        await titleElement.sendKeys(pageTitle);
        
        // await world.getActiveElement().sendKeys(pageTitle);
        await world.driver.switchTo().defaultContent();
        
        
    }
    
    async editPage(pageTitle) {
        
        const world = this.#world;
        
        await world.openUrl( `/wp-admin/` );
        await world.clickOn(`a:contains("Pages")`);
        await world.clickOn(`.page-title:contains("${pageTitle}"") a`);
        
    }
    
    async fillValue(label, value) {
        const labelElement = await this.#world.getElement(
            `label:contains("${ label }")`
        );

        const inputSelector = '#' + await labelElement.getAttribute('for');
        const inputElement = await this.#world.getElement(inputSelector);
        await inputElement.click();
        await this.waitForActiveElement(inputElement);
        
        await inputElement.clear();
        await inputElement.sendKeys(value);
    }
    
    
    // Apparently, it takes a little time to get the focus an element when we click on it
    // for some reasons I didn't find out yet
    async waitForActiveElement(expectedElement) {
        let attempts = 0;
        while (attempts++ < 10) {
            const activeElement = await this.#world.getActiveElement();
            if (activeElement === expectedElement) {
                return;
            }
            this.#world.wait(100);
        }
    }
    
}

module.exports = WordpressHelper;
