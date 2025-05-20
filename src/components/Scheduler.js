
import { Scheduler as BaseScheduler } from '@mormat/react-scheduler';

function Scheduler( props ) {
    
    // values below should be integers
    for (const k of ['minHour', 'maxHour', 'width', 'height']) {
        if (typeof props[k] === 'string' || props[k] instanceof String) {
            props[k] = parseInt(props[k]);
        }
    }
    
    if (props.locale) {
        if (isDateLocaleValid(props.locale)) {
            props.dateLocale = props.locale.split('_')[0];
        } else {
            props.dateLocale = 'en';
        }
        
        delete props.locale;
    }
    
    props.groups = ( props.groups || [] ).map(function(item) {
        const { label, ...otherValues } = item;
        return {
            text: label,
            ...otherValues
        }
    });
    props.groups.push({id: null, text: ''});
    
    return (
        <BaseScheduler { ...props } >
        </BaseScheduler>
    )
    
}



export default Scheduler;