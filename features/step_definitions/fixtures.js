 const { 
    Given, 
} = require('@cucumber/cucumber');
 
 const { expect }  = require('expect');
 
 const GROUPS_API_URL = '?rest_route=/scheduler_widget/v1/groups';
 
 Given('the groups below are defined:', async function (dataTable) {
     
    const groups = dataTable.hashes();
     
    const headers = await this.nonce.getSecuredHttpHeaders();
     
    await this.requests.sendPost(GROUPS_API_URL, { groups }, { headers } );
     
    if (this.requests.responseStatus != 200) {
        throw this.requests.responseContent;
    }
     
});

async function getSecuredHeaders(wordpress) {
    
}
