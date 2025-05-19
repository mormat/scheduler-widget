
function Overlay({ style = {}, ...otherProps }) {
    
    return (
        <div
            className="scheduler_widget_Overlay"
            { ...otherProps }
            style = { {
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                backgroundColor: 'white',
                opacity: '0.75',
                cursor: 'wait',
                ...style
            } }
        >
        </div>
    )
}

export default Overlay;