
const { 
    When
}   = require('@cucumber/cucumber');

const PASSWORDS = {
    'admin': 'admin'
}

When('I am logged as {string}', async function (username) {
    
    await this.openUrl( `/wp-login.php/` );
    
    await this.clickOn(`label:contains("Username")`);
    await this.getActiveElement().sendKeys( username );
    
    await this.clickOn(`label:contains("Password")`);
    await this.getActiveElement().sendKeys( PASSWORDS[username] );
    
    await this.clickOn(`input[value="Log In"]`);
    await this.waitForText("Dashboard");
});

When(
    'I edit a new {string} page', 
    async function (pageTitle) {

        await this.openUrl( `/wp-admin/` );
        await this.clickOn(`a:contains("Pages")`);
        await this.clickOn(`#wpbody a:contains("Add Page")`);
        await this.clickOn(`.components-modal__header button`);
        await this.wait();
        await this.driver.switchTo().frame(0);
        await this.getActiveElement().sendKeys(pageTitle);
        await this.driver.switchTo().defaultContent();
        
    }
);

When(
    'I add a {string} block', 
    async function (blockName) {

        await this.driver.switchTo().frame(0);
        await this.clickOn(`.block-editor-inserter button`);
        await this.driver.switchTo().defaultContent();
        await this.clickOn('input[placeholder="Search"]');
        await this.getActiveElement().sendKeys(blockName);
        await this.clickOn('.block-editor-inserter__panel-content button');

    }
);

When('I publish and view the page', async function () {
    await this.clickOn(`button:contains('Publish')`);
    await this.clickOn(`.editor-post-publish-panel button:contains('Publish')`);
    // await this.waitFor(`a:contains("View Page")`);
    await this.wait();
    await this.clickOn(`a:contains("View Page")`);
});
