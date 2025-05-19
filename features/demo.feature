Feature: default

    Background:
        Given WordPress has been freshly installed

    @wip
    Scenario: create a page with a scheduler
        When I am logged as "admin"
        And I edit a new "Agenda" page
        And I add a "Scheduler" block
        And I publish and view the page
        Then I should see "TODAY"
        And I should see "DAY WEEK MONTH YEAR"

