/**
 * Use this file for JavaScript code that you want to run in the front-end
 * on posts/pages that contain this block.
 *
 * When this file is defined as the value of the `viewScript` property
 * in `block.json` it will be enqueued on the front end of the site.
 *
 * Example:
 *
 * ```js
 * {
 *   "viewScript": "file:./view.js"
 * }
 * ```
 *
 * If you're not making any changes to this file because your project doesn't need any
 * JavaScript running in the front-end, then you should delete this file and remove
 * the `viewScript` property from `block.json`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#view-script
 */

import React          from 'react';
import { createRoot } from 'react-dom/client';

import $ from 'jquery';

import { Scheduler } from '@mormat/react-scheduler';

/* eslint-disable no-console */
// console.log( 'Hello World! (from create-block-scheduler-widget block)' );
/* eslint-enable no-console */

$(document).ready(function() {

    for (const element of $('.wp-block-create-block-scheduler-widget')) {

        const { namespace, ...props } = $(element).data('props');
                
        const urls  = $(element).data('urls');
        
        if (props.align === 'full' || props.align === 'wide') {
            props.width = 'auto';
        } else {
            element.style['max-width'] = 'fit-content';
        }
           
        props.onEventCreate = function(event) {
                
            $.post({
                url:  urls['saveEvent'],
                data: { ...event.getData(), namespace, id: null },
                success: function( { data }) {
                    event.id = data.id;    
                }
            });
               
        }

        props.onEventUpdate = function(event) {

            $.post({
                url:  urls['saveEvent'],
                data: { ...event.getData(), namespace } 
            });

        }
        
        props.onEventDelete = function(event) {

            $.post({
                url:  urls['deleteEvent'],
                data: { ...event.getData(), namespace }
            });

        }

        const root = createRoot(element);

        root.render( <Scheduler { ... props } /> )
        
    }
    
});
