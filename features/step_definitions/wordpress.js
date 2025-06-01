
const { 
    When
}   = require('@cucumber/cucumber');


When('I am logged as {string}', async function (username) {

    const passwords = {
        'admin': 'admin'
    }

    await this.wordpress.login({ username, password: passwords[username] });
});

When('I edit a new {string} page', async function (pageTitle) {

    await this.wordpress.addPage(pageTitle);
    
});

When('I edit the {string} page', async function (pageTitle) {

    await this.wordpress.editPage(pageTitle);

});

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

When('I select the {string} block', async function (blockName) {
    
    this.wordpress.selectBlock(blockName);
    
});

When('I set the alignment of the {string} block to {string}', async function (blockName, alignValue) {
    
    this.wordpress.selectBlock(blockName);
    
    await this.waitFor('button[aria-label="Align"]');
    await this.clickOn('button[aria-label="Align"]');
    await this.waitFor(`button:contains("${alignValue}")`);
    await this.clickOn(`button:contains("${alignValue}")`);
});

When('I publish and view the page', async function () {
    
    const buttons = [
        `button:contains('Publish')`,
        `.editor-post-publish-panel button:contains('Publish')`,
        `a:contains("View Page")`
    ]
    
    for (const button of buttons) {
        await this.waitFor(button);
        await this.clickOn(button);
    }

});

When('I save and view the page', async function () {
    await this.clickOn(".editor-post-publish-button");
    
    const notif = `.components-snackbar a:contains("View Page")`;
    await this.waitFor(notif);
    await this.clickOn(notif);
    
});
