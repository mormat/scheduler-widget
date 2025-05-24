const { 
    Given, 
    When, 
    Then
} = require('@cucumber/cucumber');

const { expect }  = require('expect');

When('I send a GET request to {string}', async function (url) {
    
    await this.requests.sendGet(url);
    
});

When(
    'I send a POST request to {string} with the JSON below:', 
    async function (url, jsonContent) {

        await this.requests.sendPost(url, JSON.parse(jsonContent) );

    }
);

When(
    'I send a secured POST request to {string} with the JSON below:', 
    async function (url, jsonContent) 
{
    await this.wordpress.activatePlugin("Test Nonce Provider");

    const nonce = await this.getPageText('.test_nonce_provider_wp_rest');

    const cookies = await this.driver.manage().getCookies();

    const headers = {
        'X-WP-Nonce': nonce, 
        'cookie': cookies.filter(
            ({name}) => name.startsWith('wordpress_logged_in') || name.startsWith('wordpress_test_cookie')
        ).map(
            ({name, value}) => name + '=' + value
        ).join(';')
    }

    await this.requests.sendPost(url, JSON.parse(jsonContent), { headers } );
});


Then('I should get {float} response containing:', function (statusCode, expectedText) {
    
    expect( this.requests.responseStatus ).toBe(statusCode);
    
    const responseBody = JSON.stringify( this.requests.responseContent );
    
    expect( responseBody ).toContain(expectedText.trim());
    
});

Then(
    'I should get a {int} response with JSON below:', 
    function (statusCode, jsonContent) {
        
        expect( this.requests.responseStatus ).toBe(statusCode);
        
        const { responseContent } = this.requests;
    
        expect( responseContent ).toStrictEqual( JSON.parse(jsonContent) );
    }
);
