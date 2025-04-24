function calcBreakpoint( props ) {
    
    const width = parseInt( props.width );
    if (!isNaN(width)) {
        if (width < 576) {
            return 'xs';
        }
    }
    
    return 'xxl';
}

function withBreakpoint(WrappedComponent) {
    
    return function( props ) {
        
        const breakpoint = calcBreakpoint( props );
        
        return (
            <div
                className = { "scheduler-widget-withBreakpoint-" + breakpoint }
                style = { { height: "100%" }}
            >
                <WrappedComponent { ...props } />
            </div>
        );
        
    }
    
}

export {
    withBreakpoint
}