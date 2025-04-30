<?php

/*
 * Plugin Name: Scheduler Widget
 * Plugin URI: https://github.com/mormat/scheduler-widget
 * Description: A scheduler widget inspired by Google Calendar
 * Version: 0.1.4
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
    
    load_plugin_textdomain(
        'scheduler-widget',
        false,
        implode(
            DIRECTORY_SEPARATOR,
            [ basename(__DIR__), 'languages' ]
        ),
    );
    
}

add_action('plugins_loaded', 'scheduler_widget_plugins_loaded' );

function scheduler_widget_activation_hook()
{
    global $wpdb;

    $tablename = $wpdb->prefix . "scheduler_widget_events";
    
    $charset_collate = $wpdb->get_charset_collate();
    
    $sql = "CREATE TABLE $tablename (  
        id bigint(20) unsigned NOT NULL AUTO_INCREMENT, 
        namespace tinytext NOT NULL,
        label text NOT NULL, 
        start datetime DEFAULT '0000-00-00 00:00:00' NOT NULL, 
        end datetime DEFAULT '0000-00-00 00:00:00' NOT NULL, 
        bgColor tinytext, 
        data text,
        created_by bigint(20) unsigned DEFAULT 0 NOT NULL,
        created_at datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
        updated_at datetime DEFAULT '0000-00-00 00:00:00',
        PRIMARY KEY  (id),
        KEY namespace (namespace),
        KEY start (start),
        KEY end (end)
    ) $charset_collate;";
    
    require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
    dbDelta( $sql );
}

register_activation_hook(__FILE__, 'scheduler_widget_activation_hook');

function scheduler_widget_get_events($namespace)
{
    global $wpdb;
    
    $tablename = $wpdb->prefix . "scheduler_widget_events";
    
    $sql = $wpdb->prepare( 
        'SELECT id, label, start, end, bgColor'.
        ' FROM ' . $tablename .
        ' WHERE namespace = %s',
        $namespace 
    );
    
    return $wpdb->get_results($sql, ARRAY_A);
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

add_action("wp_ajax_scheduler_widget_delete_event", "scheduler_widget_ajax_delete_event");
