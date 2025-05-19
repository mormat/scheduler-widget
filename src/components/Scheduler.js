
import { Scheduler as BaseScheduler } from '@mormat/react-scheduler';

function Scheduler( props ) {
    
    // values below should be integers
    for (const k of ['minHour', 'maxHour', 'width', 'height']) {
        if (typeof props[k] === 'string' || props[k] instanceof String) {
            props[k] = parseInt(props[k]);
        }
    }
    
    if (props.locale) {
        
        let dateLocale = props.locale.split('_')[0];
        if (!isDateLocaleValid(dateLocale)) {
            dateLocale = 'en';
        }
        props.dateLocale = dateLocale;
        
        delete props.locale;
    }
    
    console.log({props});
    
    props.groups = [
        ...(props.groups || []),
        {id: null, label: ''}
    ];
        
    return (
        <BaseScheduler { ...props } >
        </BaseScheduler>
    )
    
}

function isDateLocaleValid(dateLocale) {
    const d = new Date();
    try {
        d.toLocaleString(dateLocale);
    } catch (error) {
        return false;
    }
    return true;
}


export default Scheduler;