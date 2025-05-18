function getAlignFromBlockProps( { className = "" } ) {
    const aligns = ['wide', 'full', 'left', 'center', 'right'];
    const classNames = className.split(' ');
    for (const align of aligns) {
        if (classNames.includes('align' + align)) {
            return align;
        }
    }
}

function cleanSchedulerProps(props) {
    
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
    
    return props;
    
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

export { 
    cleanSchedulerProps,
    getAlignFromBlockProps,
    isDateLocaleValid
}