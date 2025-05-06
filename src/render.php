<?php
/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

$props = $attributes + [
    'events'    => scheduler_widget_get_events($attributes['namespace']),
    'editable'  => is_user_logged_in(),
    'draggable' => is_user_logged_in(),
    'locale'    => null,
];

$props['translations'] = [
    "header.today" =>        __("Today", 'scheduler-widget'),
    "header.day"   =>        __("day", 'scheduler-widget'),
    "header.week"  =>        __("week", 'scheduler-widget'),
    "header.month" =>        __("month", 'scheduler-widget'),
    "header.year"  =>        __("year",  'scheduler-widget'),
    "event_desc_label" =>    __("Description", 'scheduler-widget'),
    "event_start_label" =>   __("Starts from", 'scheduler-widget'),
    "event_end_label"   =>   __("Ends at",    'scheduler-widget'),
    "event_bgcolor_label" => __('Color', 'scheduler-widget'),
    "ok_btn" =>              __("Ok",   'scheduler-widget'),
    "cancel_btn" =>          __("Cancel", 'scheduler-widget'),
    "delete_btn" =>          __("Delete", 'scheduler-widget'),
    "add_event_btn" =>       __("Add an event"),
    "edit_event_btn" =>      __("Edit the event"),
    'delete_event_confirm_msg' => __(
        "Delete the '%event_label%' event ?", 
        'scheduler-widget'
    )
];

if (!$props['locale']) {
    $props['locale'] = get_locale();
}

$urls = array_map(fn($url) => wp_nonce_url($url, 'scheduler_widget_events'), [
    'saveEvent' => admin_url('admin-ajax.php?' . http_build_query([
        'action' => 'scheduler_widget_save_event',
    ])),
    'deleteEvent' => admin_url('admin-ajax.php?' . http_build_query([
        'action' => 'scheduler_widget_delete_event',
    ]))
]);

$props = apply_filters(
    'scheduler_widget_filter_props', 
    $props, 
    ['namespace' => $attributes['namespace']]
);

$dataProps = json_encode($props ?? []);
$dataUrls  = json_encode($urls);

?>
<div 
    <?php echo get_block_wrapper_attributes(); ?>
    data-props  = "<?php echo esc_attr($dataProps) ?>"
    data-urls   = "<?php echo esc_attr($dataUrls) ?>"
></div>


