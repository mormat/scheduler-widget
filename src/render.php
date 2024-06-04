<?php
/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

$props = $attributes + [
    'events'    => scheduler_widget_get_events($attributes['namespace']),
    'editable'  => is_user_logged_in(),
    'draggable' => is_user_logged_in(),
];

$urls = array_map(fn($url) => wp_nonce_url($url, 'scheduler_widget_events'), [
    'saveEvent' => admin_url('admin-ajax.php?' . http_build_query([
        'action' => 'scheduler_widget_save_event',
    ])),
    'deleteEvent' => admin_url('admin-ajax.php?' . http_build_query([
        'action' => 'scheduler_widget_delete_event',
    ]))
]);

$dataProps = json_encode($props);
$dataUrls  = json_encode($urls);

?>
<div 
    <?php echo get_block_wrapper_attributes(); ?>
    data-props  = "<?php echo esc_attr($dataProps) ?>"
    data-urls   = "<?php echo esc_attr($dataUrls) ?>"
></div>


