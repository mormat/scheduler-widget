
import Scheduler from './Scheduler';

import {
    getAlignFromBlockProps
} from '../utils';


function SchedulerPreview({ attributes, blockProps, groups }) {
    
    const align = getAlignFromBlockProps(blockProps);
    const width = ['full', 'width'].includes(align) ? 'aito': attributes.width;
    
    return (
        <div style = {{ 
            width: '100%',
            height: '100%',
            overflow: 'hidden'
        }}>

            <Scheduler 
                    { ... attributes }
                    editable    = { false }
                    draggable   = { false }
                    useBreakpoint = { true }
                    groups = { groups }
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