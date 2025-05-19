
import Scheduler from './Scheduler';
import Overlay from './Overlay';
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
            overflow: 'hidden',
        }}>

            <Scheduler 
                    { ... attributes }
                    editable    = { false }
                    draggable   = { false }
                    useBreakpoint = { true }
                    groups = { groups }
            />

            <Overlay style = {{ cursor: "not-allowed", opacity: "0.35" }} />

        </div>        
    )
    
}

export default SchedulerPreview;