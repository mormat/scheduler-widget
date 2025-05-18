
import { 
    ResizableBox
} from '@wordpress/components';


import {
    getAlignFromBlockProps
} from '../utils';

function SchedulerResizableBlock({ 
    attributes, 
    setAttributes, 
    toggleSelection,
    blockProps = {},
    children 
}) {
    const {
        width,
        height
    } = attributes;
    
    const align = getAlignFromBlockProps(blockProps);
    const isWidthAuto = ['full', 'wide'].includes(align);
    
    const blockStyle = { ...blockProps.style };
    blockStyle['height'] = attributes.height;
    if (align === 'center') {
        blockStyle['maxWidth'] = 'fit-content';
    }
    
    return (
        <div { ...blockProps } style = { blockStyle } >
            <ResizableBox
                size      = { { height, width: isWidthAuto ? 'auto' : width } }
                minWidth  = "480"
                minHeight = "480"
                enable={ {
                    top: false,
                    right:       !isWidthAuto,
                    bottom:      true,
                    left:        !isWidthAuto,
                    topRight:    false,
                    bottomRight: !isWidthAuto,
                    bottomLeft:  !isWidthAuto,
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
                { children }
            </ResizableBox>       
        </div>
    )
}

export default SchedulerResizableBlock;
