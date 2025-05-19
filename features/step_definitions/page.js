const { 
    Given, 
    When, 
    Then,
    AfterAll
} = require('@cucumber/cucumber');

const { expect }  = require('expect');

When('I open {string}', async function (url) {
    
    await this.openUrl( url );
    
});

Then('I should see {string}', async function (expectedText) {
    
    const pageText = await this.getPageText();
    
    expect(pageText).toContain(expectedText);
    
});

