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

Then('I should see:', async function (dataTable) {
    
    const pageText = await this.getPageText();
    
    for (const row of dataTable.raw()) {
        expect(pageText).toContain(row[0]);
    }
    
})

Then('I should not see {string}', async function (expectedText) {
    
    const pageText = await this.getPageText();
    
    expect(pageText).not.toContain(expectedText);
    
});

When('I reload the page', async function () {

    await this.driver.navigate().refresh();
    
});

Then('I should only see {string} once', async function (expectedText) {
    
    const pageText = await this.getPageText();
    
    // @todo this.page.countOccurrencesOf()
    expect(pageText).toContain(expectedText);
    expect(pageText.indexOf(expectedText)).toBe(
        pageText.lastIndexOf(expectedText)
    );
    
});
