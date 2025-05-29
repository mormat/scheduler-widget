
import { InspectorControls } from '@wordpress/block-editor';

import { __ } from '@wordpress/i18n';

import { 
    PanelBody, 
    TextControl, 
    ToggleControl, 
    SelectControl, 
    NumberControl,
    CheckboxControl,
    BaseControl,
    Flex, 
    FlexBlock, 
    FlexItem
} from '@wordpress/components';

import { useState } from '@wordpress/element';

import { getAlignFromBlockProps } from '../utils';

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
                
            <PanelBody title={ __( 'Main settings', 'scheduler-widget' ) }
                className="scheduler-widget-settings-panel"
            >
                <BaseControl 
                    label={ __('Events groups','scheduler-widget') }
                >
                    <Flex>  
                        <FlexItem>
                            <CheckboxControl
                                value = { attributes.showGroups }
                                onChange = { ( value ) =>
                                    setAttributes( { showGroups: value } )
                                }
                                checked = { attributes.showGroups }
                                label={ __('Display groups', 'scheduler-widget') }
                                __nextHasNoMarginBottom
                            />
                        </FlexItem>
                        <FlexBlock
                            style={{ 
                                display: "flex", 
                                justifyContent: "right", 
                            }}
                        >
                            <ManageGroupsButton 
                                onAsyncLoad = { () => groupsLoader.results }
                                onAsyncSave = { handleSaveGroups }
                                disabled = { 
                                    !attributes.showGroups || 
                                    isGroupsReloading || 
                                    groupsSaver.isPending 
                                }
                            />
                        </FlexBlock>
                    </Flex>
                </BaseControl>
                    
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

                <BaseControl
                    label={ __('Size','scheduler-widget') }
                >
                    <Flex>
                        <FlexBlock>
                            <TextControl
                                value = { attributes.width }
                                onChange={ v => setAttributes( { width: v } ) }
                                label={ __( 'width (px)', 'scheduler-widget' ) }
                                min = "480"
                                max = "1080"
                                type="number"
                                disabled = { ['full', 'wide'].includes(align) }
                            />    
                        </FlexBlock>
                        <FlexBlock>
                            <TextControl
                                value = { attributes.height }
                                onChange = { v => setAttributes( { height: v } ) }
                                label = { __( 'height (px)', 'scheduler-widget' ) }
                                min = "480"
                                max = "1080"
                                type="number"
                            />    
                        </FlexBlock>
                    </Flex>
                </BaseControl>

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

            <PanelBody title={ __( 'Week settings', 'scheduler-widget' ) }
                className="scheduler-widget-settings-panel"
            >
                <BaseControl
                    label={ __('Hour range','scheduler-widget') }
                >
                    <Flex>
                        <FlexBlock>
                            <TextControl
                                value={ attributes.minHour }
                                onChange={ v => setAttributes( { minHour: v } ) }
                                label={ __( 'hour min', 'scheduler-widget' ) }
                                type="number"
                                min = "5"
                                max = "10"
                            />
                        </FlexBlock>
                        <FlexBlock>
                            <TextControl
                                value={ attributes.maxHour }
                                onChange={ v => setAttributes( { maxHour: v } ) }
                                label={ __( 'hour max', 'scheduler-widget' ) }
                                type="number"
                                min = "18"
                                max = "22"
                            />
                        </FlexBlock>
                    </Flex>
                </BaseControl>
            </PanelBody>

        </InspectorControls>        
    )

}

export default SchedulerInspectorControls;