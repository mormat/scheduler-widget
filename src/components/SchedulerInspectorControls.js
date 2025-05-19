
import { InspectorControls } from '@wordpress/block-editor';

import { __ } from '@wordpress/i18n';

import { 
    PanelBody, 
    TextControl, 
    ToggleControl, 
    SelectControl, 
    NumberControl,
    CheckboxControl
} from '@wordpress/components';

import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

import { useState, useEffect } from '@wordpress/element';
import { useSelect } from "@wordpress/data";

import {
    getAlignFromBlockProps
} from '../utils';

import ManageGroupsButton from './ManageGroupsButton';

import { useGroupsSaver } from '../hooks/api';

function SchedulerInspectorControls({ 
    attributes, 
    setAttributes, 
    blockProps,
    groupsLoader,
    isGroupsReloading
}) {
    
    const { namespace } = attributes;
    
    const groupsSaver = useGroupsSaver({ namespace });

    const align = getAlignFromBlockProps(blockProps);
    
    async function handleSaveGroups(data) {
        await groupsSaver.exec({ data });
        await groupsLoader.exec();
    }

    return (
        <InspectorControls>
                
            <PanelBody title={ __( 'Settings', 'scheduler-widget' ) }>

                <CheckboxControl
                    value = { attributes.showGroups }
                    onChange = { ( value ) =>
                        setAttributes( { showGroups: value } )
                    }
                    checked = { attributes.showGroups }
                    label={ __('Display groups', 'scheduler-widget') }
                    __nextHasNoMarginBottom
                />

                <ManageGroupsButton 
                    onAsyncLoad = { () => groupsLoader.results }
                    onAsyncSave = { handleSaveGroups }
                    disabled = { 
                        !attributes.showGroups || 
                        isGroupsReloading || 
                        groupsSaver.isPending 
                    }
                />
                    
                <hr/>

                <SelectControl
                    value={ attributes.viewMode }
                    onChange={ ( value ) =>
                        setAttributes( { viewMode: value } )
                    }
                    label={ __('Default view mode', 'scheduler-widget') }
                    options={ [
                        { 
                            label: __('day', 'scheduler-widget'), 
                            value: 'day' 
                        },
                        { 
                            label: __('week', 'scheduler-widget'), 
                            value: 'week' 
                        },
                        { 
                            label: __('month', 'scheduler-widget'),
                            value: 'month' 
                        },
                        { 
                            label: __('year', 'scheduler-widget'),
                            value: 'year' 
                        },
                    ] }
                    
                />
                
                <TextControl
                    value={ attributes.initialDate }
                    onChange={ v => setAttributes( { initialDate: v } ) }
                    label={ __('Initial date','scheduler-widget') }
                    help = { __("If not provided, the current date will be used", 'scheduler-widget') }
                    type="date"
                />

                <TextControl
                    value={ attributes.minHour }
                    onChange={ v => setAttributes( { minHour: v } ) }
                    label={ __( 'Hour min', 'scheduler-widget' ) }
                    type="number"
                    min = "5"
                    max = "10"
                />

                <TextControl
                    value={ attributes.maxHour }
                    onChange={ v => setAttributes( { maxHour: v } ) }
                    label={ __( 'Hour max', 'scheduler-widget' ) }
                    type="number"
                    min = "18"
                    max = "22"
                />                        

                <TextControl
                    value = { attributes.width }
                    onChange={ v => setAttributes( { width: v } ) }
                    label={ __( 'Width (px)', 'scheduler-widget' ) }
                    min = "480"
                    max = "1080"
                    type="number"
                    disabled = { ['full', 'wide'].includes(align) }
                />

                <TextControl
                    value = { attributes.height }
                    onChange = { v => setAttributes( { height: v } ) }
                    label = { __( 'Height (px)', 'scheduler-widget' ) }
                    min = "480"
                    max = "1080"
                    type="number"
                />

                <TextControl
                    value={ attributes.namespace }
                    onChange={ v => setAttributes( { namespace: v } ) }
                    label = { __( 'Events namespace', 'scheduler-widget' ) }
                    help = { __("Display and manage a specific set of events", 'scheduler-widget') }
                />

                <TextControl
                    value = { attributes.locale }
                    onChange = { v => setAttributes( { locale: v } ) }
                    label={ __( 'Dates language code', 'scheduler-widget' ) }
                    help = { __("The language code used for displaying the dates in the scheduler. It must be ISO 639-1 compliant. If not provided, the current site language will be used", 'scheduler-widget') }
                    placeholder= { __("Examples: en, fr or es", 'scheduler-widget') }
                />

            </PanelBody>

        </InspectorControls>        
    )

}

export default SchedulerInspectorControls;