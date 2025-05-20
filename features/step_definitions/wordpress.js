
const { 
    When
}   = require('@cucumber/cucumber');


When('I am logged as {string}', async function (username) {

    const passwords = {
        'admin': 'admin'
    }

    await this.wordpress.login({ username, password: passwords[username] });
});

When(
    'I edit a new {string} page', 
    async function (pageTitle) {

        await this.openUrl( `/wp-admin/` );
        await this.clickOn(`a:contains("Pages")`);
        await this.clickOn(`#wpbody a:contains("Add Page")`);
        
        // Skip a very annoying popup explaining the usage of the block editor
        // that appears the first time we edit a page.
        try {
            await this.clickOn(`.components-modal__header button`);
        } catch {}
        await this.waitForText("Save draft");
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
    await this.waitFor(`a:contains("View Page")`);
    await this.clickOn(`a:contains("View Page")`);
});
