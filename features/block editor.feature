@block_editor
Feature: using the widget in the Block Editor

    Background:
        Given Wordpress has been freshly installed

    @default
    Scenario: create a page with a scheduler
        When I am logged as "admin"
        And I edit a new "Agenda" page
        And I add a "Scheduler" block
        And I publish and view the page
        Then I should see "TODAY"
        And I should see "DAY WEEK MONTH YEAR"

    @groups
    Scenario: creating groups
        When I am logged as "admin"
        And I edit a new "Agenda" page
        And I add a "Scheduler" block
        And I enable the groups display
        And I open the groups list
        And I add the "Room 1" group
        And I add the "Room 2" group
        And I add the "Room 3" group
        And I save the groups list
        And I publish and view the page
        Then I should see:
            | Room 1 |
            | Room 2 |
            | Room 3 |
    
    @groups
    Scenario: updating and deleting groups
        Given I am logged as "admin"
        And the groups below are defined:
            | label  |
            | Room A |
            | Room B |
            | Room C |
        When I edit a new "Agenda" page
        And I add a "Scheduler" block
        And I enable the groups display
        And I open the groups list
        And I update the "Room B" with "Room 2"
        And I delete the "Room C" group
        And I save the groups list
        And I publish and view the page
        Then I should see:
            | Room A |
            | Room 2 |

    @groups @namespace
    Scenario: the namespace should display another set of groups
        When I am logged as "admin"
        And I send a secured POST request to "?rest_route=/api/v1/groups" with the JSON below: 
            ```
                {
                    "groups": [
                        {"id": null, "label": "Room A"}
                    ]
                }
            ``` 
            And I edit a new "Agenda" page
            And I add a "Scheduler" block
            And I enable the groups display
            And I change the "Events namespace" of the scheduler to "task_by_persons"
            And I open the groups list
            And I add the "John Doe" group
            And I save the groups list
            And I publish and view the page
            Then I should see "John Doe"
            And I should not see "Room A"
