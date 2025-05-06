function cleanSchedulerProps(props) {
    
    // values below should be integers
    for (const k of ['minHour', 'maxHour', 'width', 'height']) {
        if (typeof props[k] === 'string' || props[k] instanceof String) {
            props[k] = parseInt(props[k]);
        }
    }
    
    if (props.locale) {
        props.dateLocale = props.locale.split('_')[0];
        delete props.locale;
    }
    
    return props;
    
}

export { 
    cleanSchedulerProps 
}