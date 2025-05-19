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
    const headers = await this.nonce.getSecuredHttpHeaders();

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
