const { 
    When,
    Then
}   = require('@cucumber/cucumber');

const { expect }  = require('expect');

const OVERLAY_NOT_VISIBLE = `.scheduler_widget_View:not(:has(.scheduler_widget_Overlay))`;

Then('I should see a page with a scheduler', async function () {
    
    await this.getElement('.page .mormat-scheduler');
    
});

When('I create an event with:', async function (dataTable) {

    await this.eventsForm.createEvent( dataTable.rowsHash() );
    
    await this.waitFor(OVERLAY_NOT_VISIBLE);
    
});

When('I update the {string} event with:', async function (eventName, dataTable) {
           
    await this.eventsForm.updateEvent( eventName, dataTable.rowsHash() );
    
    await this.waitFor(OVERLAY_NOT_VISIBLE);
           
});

When('I delete the {string} event', async function (eventName) {
    
    await this.eventsForm.deleteEvent( eventName );
    
    await this.waitFor(OVERLAY_NOT_VISIBLE);
    
});

Then(
    'the {string} event should be displayed at {string} from {string} to {string}', 
    async function (eventName, atDate, fromHour, toHour) {
    
        const eventElement = await this.events.getElement(eventName);
        
        await this.daysview.expectElementAtDayFromHourToHour(
            eventElement,
            atDate, 
            fromHour, 
            toHour
        );
    
    }
);

When('I drag the {string} event to {string} at {string}', async function (eventName, atDate, toHour) {
    
    const eventElement = await this.events.getElement(eventName);
    
    await this.daysview.dragElementToDateAtHour(
        eventElement,
        atDate, 
        toHour
    );

    await this.waitFor(OVERLAY_NOT_VISIBLE);
});

When('I drag the {string} event to {string} in the {string} group', async function (eventName, to, inGroup) {

    const eventElement = await this.events.getElement(eventName);

    await this.groupsview.dragElementToColumnInGroup(
        eventElement,
        to,
       inGroup
    )

});

Then('the {string} event should be displayed between {string} and {string} in the {string} group', async function (eventName, from, to, inGroup) {
    const eventElement = await this.events.getElement(eventName);
        
    await this.groupsview.expectElementBetweenRangeInGroup(
        eventElement,
        from,
        to,
       inGroup
    );        
});