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

import { 
    Scheduler,
    withEventForm,
    DefaultEventForm,
    utils
} from '@mormat/react-scheduler';

import { withBreakpoint } from './utils';

/* eslint-disable no-console */
// console.log( 'Hello World! (from create-block-scheduler-widget block)' );
/* eslint-enable no-console */

const SchedulerWithEventForm = withEventForm(
    withBreakpoint( Scheduler ), 
    DefaultEventForm
);

$(document).ready(function() {

    for (const element of $('.wp-block-create-block-scheduler-widget')) {

        const { namespace, ...props } = $(element).data('props');
                
        const urls  = $(element).data('urls');
        
        for (const k of ['minHour', 'maxHour', 'width', 'height']) {
            if (typeof props[k] === 'string' || props[k] instanceof String) {
                props[k] = parseInt(props[k]);
            }
        }
        
        if (props.align === 'full' || props.align === 'wide') {
            props.width = 'auto';
        } else {
            element.style['max-width'] = 'none';
            if (props.width) {
                element.style['width'] = props.width + 'px';
            }
            if (props.width) {
                element.style['height'] = props.height + 'px';
            }
        }
        
        if (props.locale) {
            props.dateLocale = props.locale.split('_')[0];
            delete props.locale;
        }
        
        props.onEventCreate = function(values, { scheduler }) {
                
            $.post({
                url:  urls['saveEvent'],
                data: { ...values, namespace, id: null },
                success: function( { data }) {
                    scheduler.replaceEvent(data, i => i.id == values.id)
                }
            });
               
        }

        props.onEventUpdate = function(values, { valuesBefore }) {
    
            const url  = urls['saveEvent'];
            const data = { ...valuesBefore, ...values, namespace }

            for (const k of ['start', 'end']) {    
                data[k] = utils.format_date(
                    'yyyy-mm-dd hh:ii',
                    data[k]
                );
            }

            $.post({ url, data });
                
        }
        
        props.onEventDelete = function(values) {

            $.post({
                url:  urls['deleteEvent'],
                data: { ...values, namespace }
            });

        }
        
        if (props.draggable) {
            props.onEventDrop = (values, options) => {
                props.onEventUpdate(values, options);
            };
            props.onEventResize = (values, options) => {
                props.onEventUpdate(values, options);
            };
        }

        const root = createRoot(element);

        root.render( <SchedulerWithEventForm { ... props } /> )
        
    }
    
});
