
import { Scheduler } from '@mormat/react-scheduler';

import {
    getAlignFromBlockProps,
    cleanSchedulerProps
} from '../utils';


function SchedulerPreview({ attributes, blockProps }) {
    
    const align = getAlignFromBlockProps(blockProps);
    const width = ['full', 'width'].includes(align) ? 'aito': attributes.width;
    
    const { 
        initialDate, 
        viewMode, 
        height, 
        minHour, 
        maxHour,
        namespace,
        locale
    } = attributes;
    
    const schedulerProps = cleanSchedulerProps( attributes );
    
    return (
        <div style = {{ 
            width: '100%',
            height: '100%',
            overflow: 'hidden'
        }}>

            <Scheduler 
                    { ... schedulerProps }
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
    
}

export default SchedulerPreview;