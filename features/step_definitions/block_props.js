
const { 
    When
}   = require('@cucumber/cucumber');

When('I enable the groups display', async function () {

    await this.clickOn(`label:contains("Display groups")`);
    
});

 When('I open the groups list', async function () {
    const button = `button:contains("Manage groups")`;
    await this.waitFor(button + ':not([disabled])');
    
    const element = await this.getElement(button);
    await this.driver.actions()
      .scroll(0, 0, 0, 0, element)
      .perform();
    
    await this.clickOn(button);
    await this.waitForText("Add group");
});

When('I add the {string} group', async function (value) {

    const parent = '.scheduler_widget_ManageGroupsModal ';

    await this.clickOn( parent + `button:contains("Add group")` );
    await this.clickOn( parent + 'tr:last-child input[type=text]' );
    await this.getActiveElement().sendKeys(value);

});

When(
    "I update the {string} with {string}", 
    async function (value, newValue) {
        const parent = '.scheduler_widget_ManageGroupsModal ';
        const input  = `input[value='${value}']`;
    
        await this.clickOn(parent + input);
        const element = await this.getActiveElement();
        element.clear();
        element.sendKeys(newValue);
    }
);

When('I delete the {string} group', async function (value) {
    const parent = '.scheduler_widget_ManageGroupsModal ';
    const input  = `input[value='${value}']`;
    const button = parent + `tr:has(${input}) button`;
    await this.clickOn(input);
});

When('I save the groups list', async function () {
    const parent = '.scheduler_widget_ManageGroupsModal';
    
    await this.clickOn(parent + ` button:contains("Save")`);
});

When('I change the namespace to {string}', async function (namespace) {
    
    await this.clickOn(`label:contains("Events namespace")`);
    
    const input = await this.getActiveElement();
    await input.clear();
    await input.sendKeys(namespace);
    
    
    
});