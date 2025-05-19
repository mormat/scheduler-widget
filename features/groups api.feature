@groups_api
Feature: Groups API

    Background:
        Given Wordpress has been freshly installed

    Scenario: GET /scheduler_widget/v1/groups
        When I send a GET request to "?rest_route=/scheduler_widget/v1/groups" 
        Then I should get a 200 response with JSON below:
        ```
            {
                "groups": []
            }
        ```

    Scenario: POST /scheduler_widget/v1/groups with missing 'groups' attributes
        Given I am logged as "admin"
        When I send a secured POST request to "?rest_route=/scheduler_widget/v1/groups" with the JSON below: 
        ```
            {}
        ```
        Then I should get 400 response containing:
        ```
            Missing parameter(s): groups
        ```

    Scenario: POST /scheduler_widget/v1/groups with missing 'label' attribute
        Given I am logged as "admin"
        When I send a secured POST request to "?rest_route=/scheduler_widget/v1/groups" with the JSON below: 
        ```
            {
                "groups": [
                    {"id": 2}
                ]
            }
        ```
        Then I should get 400 response containing:
        ```
            label is a required property of groups[0].
        ```

    Scenario: POST /scheduler_widget/v1/groups should return 401 for anonymous user
        When I send a POST request to "?rest_route=/scheduler_widget/v1/groups" with the JSON below: 
        ```
            {
                "groups": [
                    { "id": null, "label": "Room A" }
                ]
            }
        ```
        Then I should get 401 response containing:
        ```
            not allowed
        ```

    Scenario: POST /scheduler_widget/v1/groups should remove CSRF attacks
        Given I am logged as "admin"
        When I send a secured POST request to "?rest_route=/scheduler_widget/v1/groups" with the JSON below: 
        ```
            {
                "groups": [
                    {"id": null, "label": "<script>alert('hacked')</script>"}
                ]
            }
        ```            
        And I send a GET request to "?rest_route=/scheduler_widget/v1/groups" 
        Then I should get a 200 response with JSON below:
        ```
            {
                "groups": [
                    {"id": 1, "label": ""}
                ]
            }
        ```

    Rule: Using pre-populated items

        Background:
            Given I am logged as "admin"
            When I send a secured POST request to "?rest_route=/scheduler_widget/v1/groups" with the JSON below: 
            ```
                {
                    "groups": [
                        {"id": null, "label": "Room A"},
                        {"id": null, "label": "Room B"},
                        {"id": null, "label": "Room C"}
                    ]
                }
            ``` 

        Scenario: GET /scheduler_widget/v1/groups should return existing items
            When I send a GET request to "?rest_route=/scheduler_widget/v1/groups" 
            Then I should get a 200 response with JSON below:
            ```
                {
                    "groups": [
                        {"id": 1, "label": "Room A"},
                        {"id": 2, "label": "Room B"},
                        {"id": 3, "label": "Room C"}
                    ]
                }
            ```

        Scenario: POST /scheduler_widget/v1/groups should update existing item
            Given I am logged as "admin"
            When I send a secured POST request to "?rest_route=/scheduler_widget/v1/groups" with the JSON below: 
            ```
                {
                    "groups": [
                        {"id": 2, "label": "Room B bis"}
                    ]
                }
            ```            
            And I send a GET request to "?rest_route=/scheduler_widget/v1/groups" 
            Then I should get a 200 response with JSON below:
            ```
                {
                    "groups": [
                        {"id": 1, "label": "Room A"},
                        {"id": 2, "label": "Room B bis"},
                        {"id": 3, "label": "Room C"}
                    ]
                }
            ```

        Scenario: POST /scheduler_widget/v1/groups should delete existing item
            Given I am logged as "admin"
            When I send a secured POST request to "?rest_route=/scheduler_widget/v1/groups" with the JSON below: 
            ```
                {
                    "groups": [
                        {"id": 2, "label": "Room B", "#deleted": true}
                    ]
                }
            ```            
            And I send a GET request to "?rest_route=/scheduler_widget/v1/groups" 
            Then I should get a 200 response with JSON below:
            ```
                {
                    "groups": [
                        {"id": 1, "label": "Room A"},
                        {"id": 3, "label": "Room C"}
                    ]
                }
            ```

        Scenario: handling namespaces
            Given I am logged as "admin"
            When I send a secured POST request to "?rest_route=/scheduler_widget/v1/groups&namespace=persons" with the JSON below: 
            ```
                {
                    "groups": [
                        {"id": null, "label": "John Doe"}
                    ]
                }
            ``` 
            And I send a GET request to "?rest_route=/scheduler_widget/v1/groups&namespace=persons" 
            Then I should get a 200 response with JSON below:
            ```
                {
                    "groups": [
                        {"id": 4, "label": "John Doe"}
                    ]
                }
            ```
