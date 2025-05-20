@groups_api
Feature: Groups API

    Background:
        Given Wordpress has been freshly installed

    @first
    Scenario: GET /api/v1/groups
        When I send a GET request to "?rest_route=/api/v1/groups" 
        Then I should get a 200 response with JSON below:
        ```
            {
                "groups": []
            }
        ```

    @first
    Scenario: POST /api/v1/groups with missing 'groups' attributes
        When I send a POST request to "?rest_route=/api/v1/groups" with the JSON below: 
        ```
            {}
        ```
        Then I should get 400 response containing:
        ```
            Missing parameter(s): groups
        ```

    Scenario: POST /api/v1/groups with missing 'label' attribute
        When I send a POST request to "?rest_route=/api/v1/groups" with the JSON below: 
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

    Scenario: POST /api/v1/groups should return incremented id after inserting items
        When I send a POST request to "?rest_route=/api/v1/groups" with the JSON below: 
        ```
            {
                "groups": [
                    { "id": null, "label": "Room A" }
                ]
            }
        ```
        Then I should get a 200 response with JSON below:
        ```
            {
                "groups": [
                    { "id": 1, "label": "Room A" }
                ]
            }
        ```

    Scenario: POST /api/v1/groups should remove CSRF attacks
        When I send a POST request to "?rest_route=/api/v1/groups" with the JSON below: 
        ```
            {
                "groups": [
                    {"id": null, "label": "<script>alert('hacked')</script>"}
                ]
            }
        ```            
        And I send a GET request to "?rest_route=/api/v1/groups" 
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
           When I send a POST request to "?rest_route=/api/v1/groups" with the JSON below: 
            ```
                {
                    "groups": [
                        {"id": null, "label": "Room A"},
                        {"id": null, "label": "Room B"},
                        {"id": null, "label": "Room C"}
                    ]
                }
            ``` 

        Scenario: GET /api/v1/groups should return existing items
            When I send a GET request to "?rest_route=/api/v1/groups" 
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

        Scenario: POST /api/v1/groups should update existing item
            When I send a POST request to "?rest_route=/api/v1/groups" with the JSON below: 
            ```
                {
                    "groups": [
                        {"id": 2, "label": "Room B bis"}
                    ]
                }
            ```            
            And I send a GET request to "?rest_route=/api/v1/groups" 
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

        Scenario: POST /api/v1/groups should delete existing item
            When I send a POST request to "?rest_route=/api/v1/groups" with the JSON below: 
            ```
                {
                    "groups": [
                        {"id": 2, "label": "Room B", "#deleted": true}
                    ]
                }
            ```            
            And I send a GET request to "?rest_route=/api/v1/groups" 
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
            When I send a POST request to "?rest_route=/api/v1/groups&namespace=persons" with the JSON below: 
            ```
                {
                    "groups": [
                        {"id": null, "label": "John Doe"}
                    ]
                }
            ``` 
            And I send a GET request to "?rest_route=/api/v1/groups&namespace=persons" 
            Then I should get a 200 response with JSON below:
            ```
                {
                    "groups": [
                        {"id": 4, "label": "John Doe"}
                    ]
                }
            ```
