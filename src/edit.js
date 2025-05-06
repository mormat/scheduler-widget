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

import { 
    PanelBody, 
    TextControl, 
    ToggleControl, 
    ResizableBox, 
    SelectControl, 
    NumberControl 
} from '@wordpress/components';

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
        
    const { 
        initialDate, 
        viewMode, 
        width, 
        height, 
        minHour, 
        maxHour,
        namespace,
        locale
    } = attributes;
    const currentYear = new Date().getFullYear().toString();
    
    const blockProps = useBlockProps({
        style: {}
    });
    
    const isFixedWidth = (function() {
        const classNames = blockProps.className.split(' ');
        if (classNames.includes('alignfull')) return true;
        if (classNames.includes('alignwide')) return true;
        return false;
    })();
    
    if (!isFixedWidth) {
        blockProps.style.maxWidth = 'fit-content';
    }
    
    const renderWidget = () => (

        <div style = {{ 
            width: '100%',
            height: '100%',
            overflow: 'hidden'
        }}>

            <Scheduler 
                    width       = { isFixedWidth ? 'auto': width }
                    height      = { height }
                    initialDate = { initialDate }
                    viewMode    = { viewMode }
                    minHour     = { minHour }
                    maxHour     = { maxHour }
                    editable    = { false }
                    draggable   = { false }
                    useBreakpoint = { true }
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
            }} />

        </div>

    )
    
    const withResizableBox = (subject) => (
        
        <ResizableBox
            size      = { { height, width: isFixedWidth ? 'auto' : width } }
            minWidth  = "480"
            minHeight = "480"
            enable={ {
                top: false,
                right:       !isFixedWidth,
                bottom:      true,
                left:        !isFixedWidth,
                topRight:    false,
                bottomRight: !isFixedWidth,
                bottomLeft:  !isFixedWidth,
                topLeft:     false,
            } }
            onResizeStop={ ( event, direction, elt, delta ) => {
                setAttributes( {
                    height: Math.round(Number(height) + delta.height),
                    width:  Math.round(Number(width)  + delta.width),
                } );
                toggleSelection( true );
            } }
            onResizeStart={ () => {
                toggleSelection( false );
            } }
        >
            { subject }
        </ResizableBox>
        
    )
    
    return (
        <>
            <InspectorControls>
                
                <PanelBody title={ __( 'Settings', 'scheduler-widget' ) }>
                
                    <SelectControl
                        label={ __('Default view mode', 'scheduler-widget') }
                        value={ viewMode }
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
                        label={ __( 'Width (px)', 'scheduler-widget' ) }
                        value={ width }
                        onChange={ v => setAttributes( { width: v } ) }
                        min = "480"
                        max = "1080"
                        type="number"
                        disabled = { isFixedWidth }
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
                    
                    <TextControl
                        label={ __( 'Dates language code', 'scheduler-widget' ) }
                        help = { __("The language code used for displaying the dates in the scheduler. It must be ISO 639-1 compliant. If not provided, the current site language will be used", 'scheduler-widget') }
                        value={ locale }
                        onChange={ v => setAttributes( { locale: v } ) }
                        placeholder= { __("Examples: en, fr or es", 'scheduler-widget') }
                    />
                    
                </PanelBody>
                
            </InspectorControls>

            <div { ...blockProps } >

                { withResizableBox(renderWidget()) }
                
            </div>

        </>      
    );
}
