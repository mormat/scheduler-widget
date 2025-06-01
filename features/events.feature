@events
Feature: CRUD on scheduler events

    Background:
        Given Wordpress has been freshly installed
        And I am logged as "admin"
        And I edit a new "Agenda" page
        And I add a "Scheduler" block
        And I change the "Initial date" of the scheduler to "29042025"
        And I publish and view the page

    Scenario: an event that has been created should be persisted
        When I create an event with:
            | Description | Meeting |
            | Starts from | 10:00 29 April 2025 |
            | Ends at     | 12:00 29 April 2025 |
        And I reload the page
        Then the 'Meeting' event should be displayed at "Tue, Apr 29" from '10:00' to '12:00'

    Scenario: update an event
        When I create an event with:
            | Description | Meeting             |
            | Starts from | 10:00 29 April 2025 |
            | Ends at     | 12:00 29 April 2025 |
        And I reload the page
        And I update the "Meeting" event with:
            | Description | Interview           |
            | Starts from | 14:00 30 April 2025 |
            | Ends at     | 16:00 30 April 2025 |
        And I reload the page
        Then I should not see "Meeting"
        Then the 'Interview' event should be displayed at "Wed, Apr 30" from '14:00' to '16:00'
    
    Scenario: delete an event
        When I create an event with:
            | Description | Meeting             |
            | Starts from | 10:00 29 April 2025 |
            | Ends at     | 12:00 29 April 2025 |
        And I reload the page
        And I delete the "Meeting" event
        And I reload the page
        Then I should not see "Meeting"

    Scenario: switching to another namespace
        When I create an event with:
            | Description | Meeting             |
            | Starts from | 10:00 29 April 2025 |
            | Ends at     | 12:00 29 April 2025 |
        And I edit the "Agenda" page
        And I select the "Scheduler" block
        And I change the "Events namespace" of the scheduler to "tasks"
        And I save and view the page
        Then I should see a page with a scheduler
        And I should not see "Meeting"
    
    Scenario: dragging a freshly created event
        When I create an event with:
            | Description | Meeting |
            | Starts from | 10:00 29 April 2025 |
            | Ends at     | 12:00 29 April 2025 |
        And I drag the "Meeting" event to "Thu, May 1" at "10:00"
        And I reload the page
        Then I should only see "Meeting" once
        And the "Meeting" event should be displayed at "Thu, May 1" from '10:00' to '12:00'

    @groups
    Scenario: group of events should be saved
        Given I edit the "Agenda" page
        And I select the "Scheduler" block
        And I enable the groups display
        And I open the groups list
        And I add the groups below: 
            | Maria Penny   |
            | John Castillo |
            | Kate Dillard  |
            | Scott Peacock |
            | William Smith |
            | Casey Johnson |
        And I save the groups list
        And I save and view the page
        And I create an event with:
            | Description | Meeting             |
            | Starts from | 09:00 29 April 2025 |
            | Ends at     | 12:00 29 April 2025 |
        When I drag the "Meeting" event to "Tue 29" in the "John Castillo" group
        And I reload the page
        Then the "Meeting" event should be displayed between "Tue 29" and "Tue 29" in the "John Castillo" group
        