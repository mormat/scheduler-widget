<?php

/*
 * Plugin Name: Scheduler Widget
 * Plugin URI: https://github.com/mormat/scheduler-widget
 * Description: A scheduler widget inspired by Google Calendar
 * Version: 0.1.6
 * Requires at least: 6.5
 * Requires PHP: 7.2
 * License: GPLv2
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Author: Mathieu MOREL
 * Author URI: http://github.com/mormat
 * Text Domain: scheduler-widget
 * Domain Path: /languages
 */

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
    * Registers the block using the metadata loaded from the `block.json` file.
    * Behind the scenes, it registers also all assets so they can be enqueued
    * through the block editor in the corresponding context.
    *
    * @see https://developer.wordpress.org/reference/functions/register_block_type/
*/
function scheduler_widget_init() {

    load_plugin_textdomain(
        'scheduler-widget',
        false,
        basename( dirname( __FILE__ ) ) . '/languages'
    );
    
    register_block_type( __DIR__ . '/build' );   
}

add_action( 'init', 'scheduler_widget_init' );

function scheduler_widget_plugins_loaded() {
    
    $plugin_data = get_plugin_data(__FILE__, true, false);
    if ($plugin_data['Version'] != get_site_option('scheduler_widget_db_version')) {
        scheduler_widget_activation_hook();
    }
    
}

add_action('plugins_loaded', 'scheduler_widget_plugins_loaded' );

function scheduler_widget_activation_hook()
{
    global $wpdb;

    $charset_collate = $wpdb->get_charset_collate();
    
    $groupsTable = $wpdb->prefix . "scheduler_widget_groups";
    $eventsTable = $wpdb->prefix . "scheduler_widget_events";
    
    $queries = [];
    
    $queries[] = "CREATE TABLE $groupsTable (  
        id bigint(20) unsigned NOT NULL AUTO_INCREMENT, 
        namespace tinytext NOT NULL,
        label text NOT NULL,
        data text,
        created_by bigint(20) unsigned DEFAULT 0 NOT NULL,
        updated_by bigint(20) unsigned DEFAULT NULL,
        created_at datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
        updated_at datetime DEFAULT '0000-00-00 00:00:00',
        PRIMARY KEY  (id),
        KEY namespace (namespace)
    ) $charset_collate;";
    
    $queries[] = "CREATE TABLE $eventsTable (  
        id bigint(20) unsigned NOT NULL AUTO_INCREMENT, 
        namespace tinytext NOT NULL,
        label text NOT NULL, 
        start datetime DEFAULT '0000-00-00 00:00:00' NOT NULL, 
        end datetime DEFAULT '0000-00-00 00:00:00' NOT NULL, 
        bgColor tinytext, 
        data text,
        group_id bigint(20) unsigned DEFAULT NULL,
        created_by bigint(20) unsigned DEFAULT 0 NOT NULL,
        updated_by bigint(20) unsigned DEFAULT NULL,
        created_at datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
        updated_at datetime DEFAULT '0000-00-00 00:00:00',
        PRIMARY KEY  (id),
        KEY namespace (namespace),
        KEY start (start),
        KEY end (end),
        KEY group_id (group_id)    
    ) $charset_collate;";
    
    require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
    dbDelta( implode(';', $queries) );
    
    $plugin_data = get_plugin_data(__FILE__, true, false);
    update_option('scheduler_widget_db_version', $plugin_data['Version']);
    
}

register_activation_hook(__FILE__, 'scheduler_widget_activation_hook');

function scheduler_widget_get_events($namespace)
{
    global $wpdb;
    
    $tablename = $wpdb->prefix . "scheduler_widget_events";
    
    $sql = $wpdb->prepare( 
        'SELECT id, label, start, end, bgColor, group_id'.
        ' FROM ' . $tablename .
        ' WHERE namespace = %s',
        $namespace 
    );
    
    $rows = $wpdb->get_results($sql, ARRAY_A);
    return array_map(
        function($row) {
            $row['id'] = (int) $row['id'];
            $row['group_id'] = $row['group_id'] ? (int) $row['group_id'] : null;
            return $row;
        },
        $rows
    );
}

function scheduler_widget_ajax_save_event()
{
    
    check_ajax_referer('scheduler_widget_events');

    $id = absint($_POST['id']);
    
    $recordset = [
        'label'     => sanitize_text_field($_POST['label']),
        'start'     => sanitize_text_field($_POST['start']),
        'end'       => sanitize_text_field($_POST['end']),
        'bgColor'   => sanitize_text_field($_POST['bgColor']),
        'namespace' => sanitize_text_field($_POST['namespace']),
        'group_id'  => intval($_POST['group_id']),
    ];
    
    foreach (['label', 'start', 'end'] as $key) {
        if (!$recordset[$key]) {
            wp_send_json_error(sprintf("`%s` required", $key));
        }
    }
    $results = [];
    
    global $wpdb;

    $tablename = $wpdb->prefix . "scheduler_widget_events";
    if ($id) {
        $recordset['updated_by'] = get_current_user_id();
        $recordset['updated_at'] = date('Y-m-d h:i:s');
        $wpdb->update($tablename, $recordset, ['id' => $id]);
    } else {
        $recordset['created_by'] = get_current_user_id();
        $recordset['created_at'] = date('Y-m-d h:i:s');
        $wpdb->insert($tablename, $recordset);
        $results['id'] = $wpdb->insert_id;
    }
    
    wp_send_json_success($results);
}

add_action("wp_ajax_scheduler_widget_save_event", "scheduler_widget_ajax_save_event");

function scheduler_widget_ajax_delete_event()
{
    check_ajax_referer('scheduler_widget_events');
    
    $id = absint($_POST['id']);

    if (!$id) {
        wp_send_json_error("`id` required");
    }
    
    global $wpdb;
    
    $tablename = $wpdb->prefix . "scheduler_widget_events";
    
    $wpdb->delete($tablename, ['id' => $id]);
    
    wp_send_json_success([]);
}

function scheduler_widget_load_groups( array $options = [] ) {
    
    $options += [
        'namespace' => 'default',
    ];
    
    global $wpdb;
    
    $tablename = $wpdb->prefix . "scheduler_widget_groups";
    
    $sql = $wpdb->prepare( 
        'SELECT id, label'.
        ' FROM ' . $tablename.
        ' WHERE namespace = %s',
        $options['namespace']
    );
    
    $rows = $wpdb->get_results($sql, ARRAY_A);
    return array_map(
        function($row) {
            $row['id'] = (int) $row['id'];
            return $row;
        },
        $rows
    );
    
}

function scheduler_widget_save_groups( array $groups, array $options = [] ) {
    
    $options += [
        'namespace' => 'default',
    ];
    
    global $wpdb;
    
    $results = [];
    foreach ($groups as $group) {
        
        $tablename = $wpdb->prefix . "scheduler_widget_groups";
        
        if (isset($group['#deleted'])) {
            $wpdb->delete($tablename, ['id' => $group['id']]);
            continue;
        }
        
        $recordset = [
            'label' => $group['label'],
            'namespace' => $options['namespace']
        ];
        
        if ($group['id']) {
            $recordset['updated_by'] = get_current_user_id();
            $recordset['updated_at'] = date('Y-m-d h:i:s');
            $wpdb->update($tablename, $recordset, ['id' => $group['id']]);
        } else {
            $recordset['created_by'] = get_current_user_id();
            $recordset['created_at'] = date('Y-m-d h:i:s');
            $wpdb->insert($tablename, $recordset);
            $group['id'] = $wpdb->insert_id;
        }
        
        $results[] = $group;
        
    }
    
    return $results;
}

add_action("wp_ajax_scheduler_widget_delete_event", "scheduler_widget_ajax_delete_event");

function scheduler_widget_get_groups_schema() {
    return [
        '$schema' => 'https://json-schema.org/draft-04/schema#',
        'title' => 'groups',
        'type'  => 'object',
        'properties' => array(
            'groups' => array(
                'type'  => 'array',
                'items' => [
                    'type' => 'object',
                    'properties' => [
                        'id' => [
                            'type' => ['integer', 'null'],
                        ],
                        'label' => [
                            'type'     => 'string',
                            'required' => true,
                        ]
                    ]
                ]
            )
        )
    ];
}

function scheduler_widget_build_groups_api($controllers) {
    
    $schema = scheduler_widget_get_groups_schema()['properties'];
    
    $args = $schema;
    $args['groups']['required'] = true;
    $args['groups']['items']['properties']['label']['required'] = true;
    $args['groups']['sanitize_callback'] = function($items) use ($schema) {
        $is_valid = rest_validate_value_from_schema(
            $items, 
            $schema['groups'], 
            'groups'
        );
        if (is_wp_error($is_valid)) {
            return $is_valid;
        }
        return array_map(
            function($item) {
                $item['label'] = sanitize_text_field($item['label']);
                return $item;
            },
            $items
        );
    };
    
    return [
        [
            'methods' => 'GET',
            'callback' => $controllers['GET'],
            'permission_callback' => function() {
                return true;
            }
        ],
        [
            'methods' => 'POST',
            'callback' => $controllers['POST'],
            'permission_callback' => function(WP_REST_Request $request) {
                return current_user_can('edit_posts');
            },
            'args'=> $args,
        ]
    ];
    
}

function scheduler_widget_rest_api_init() {
    
    $groups_api = scheduler_widget_build_groups_api([
        'GET' => function(WP_REST_Request $request) {
        
            $options = [
                'namespace' => sanitize_text_field(
                    $request->get_param('namespace')
                )
            ];

            $groups = scheduler_widget_load_groups(
                array_filter($options)
            );

            return rest_ensure_response([
                "groups" => $groups
            ]);
        },
        'POST' => function(WP_REST_Request $request) {
            $options = [
                'namespace' => sanitize_text_field(
                    $request->get_param('namespace')
                )
            ];

            $results = scheduler_widget_save_groups( 
                $request["groups"] ,
                array_filter($options)
            );

            return rest_ensure_response([
                "groups" => $results
            ]);
        }
    ]);
    
    register_rest_route(
        'scheduler_widget/v1',
        'groups',
        $groups_api
    );
    
}

add_action('rest_api_init', 'scheduler_widget_rest_api_init');
