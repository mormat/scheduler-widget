## Template plugin for customizing the Scheduler Widget

Create a file `scheduler-widget-custom.php` in the `plugins` folder of you Wordpress website and the lines below :

```php
<?php
/**
 * @package scheduler-widget-custom
 * @version 0.0.1
 */
/*
Plugin Name: Scheduler Widget Custom
Description: Put your own customisations of the Scheduler Widget here.
Version: 0.0.1
Author: <your_name_here>
Author URI: <your_url_here>
*/

// Do not load directly.
if ( ! defined( 'ABSPATH' ) ) {
	die();
}
```

### Using filters


#### Overriding the scheduler props

The scheduler props are initially defined in the widget editor but in some case, you might need to override programatically some of the props.

Below are some examples of the props that you can override :

```php
function scheduler_widget_custom_filter_props($props) {

	// If scheduler must always be read only
	$props['editable']  = false;
	$props['draggable'] = false;

	return $props;

}

add_filter('scheduler_widget_filter_props', 'scheduler_widget_custom_filter_props');
```


