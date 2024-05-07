/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

import { PanelBody, TextControl, ToggleControl, ResizableBox, SelectControl, NumberControl} from '@wordpress/components';

import { Scheduler } from '@mormat/react-scheduler';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes, toggleSelection } ) {
        
    const { initialDate, height, viewMode, minHour, maxHour, namespace } = attributes;
    const currentYear = new Date().getFullYear().toString();
        
    // Event group
    // If provided, the events will be loaded and saved from this specific group
        
    return (
        <>
            <InspectorControls>
                
                <PanelBody title={ __( 'Settings', 'scheduler-widget' ) }>
                
                    <SelectControl
                        label={ __('Default view mode', 'scheduler-widget') }
                        value={ viewMode }
                        options={ [
                            { 
                                label: __('Day', 'scheduler-widget'), 
                                value: 'day' 
                            },
                            { 
                                label: __('Week', 'scheduler-widget'), 
                                value: 'week' 
                            },
                            { 
                                label: __('Month', 'scheduler-widget'),
                                value: 'month' 
                            },
                        ] }
                        onChange={ ( value ) =>
                            setAttributes( { viewMode: value } )
                        }
                    />
                    
                    <TextControl
                        label={ __('Initial date','scheduler-widget') }
                        help = { __("If not provided, the current date will be used", 'scheduler-widget') }
                        value={ initialDate }
                        onChange={ v => setAttributes( { initialDate: v } ) }
                        type="date"
                    />
                    
                    <TextControl
                        label={ __( 'Hour min', 'scheduler-widget' ) }
                        type="number"
                        value={ minHour }
                        onChange={ v => setAttributes( { minHour: v } ) }
                        min = "5"
                        max = "10"
                    />
                    
                    <TextControl
                        label={ __( 'Hour max', 'scheduler-widget' ) }
                        type="number"
                        value={ maxHour }
                        onChange={ v => setAttributes( { maxHour: v } ) }
                        min = "18"
                        max = "22"
                    />
                    
                    <TextControl
                        label={ __( 'Height (px)', 'scheduler-widget' ) }
                        value={ height }
                        onChange={ v => setAttributes( { height: v } ) }
                        min = "480"
                        max = "1080"
                        type="number"
                    />
                    
                    <TextControl
                        label={ __( 'Events namespace', 'scheduler-widget' ) }
                        help = { __("Display and manage a specific set of events", 'scheduler-widget') }
                        value={ namespace }
                        onChange={ v => setAttributes( { namespace: v } ) }
                    />
                    
                </PanelBody>
                
            </InspectorControls>

            <ResizableBox
                size={ { height, width: '100%' } }
                minHeight = "480"
                maxHeight = "1080"
                enable={ {
                    top: false,
                    right: false,
                    bottom: true,
                    left: false,
                    topRight: false,
                    bottomRight: false,
                    bottomLeft: false,
                    topLeft: false,
                } }
                onResizeStop={ ( event, direction, elt, delta ) => {
                    setAttributes( {
                        height: Math.round(Number(height) + delta.height)
                    } );
                    toggleSelection( true );
                } }
                onResizeStart={ () => {
                    toggleSelection( false );
                } }
            >
            
                <div { ...useBlockProps() }
                    style     = { { 
                        width: '100%', 
                        height: '100%' 
                    }}
                >              
                    <Scheduler 
                        width       = "auto" 
                        height      = { height }
                        initialDate = { initialDate }
                        viewMode    = { viewMode }
                        minHour     = { minHour }
                        maxHour     = { maxHour }
                        editable    = { false }
                        draggable   = { false }
                    />
                
                    <div style = {{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'white',
                        opacity: '0.35',
                        cursor: 'not-allowed',
                    }}></div>
                    
                </div>
                
            </ResizableBox>

        </>      
    );
}
