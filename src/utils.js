function getAlignFromBlockProps( { className = "" } ) {
    const aligns = ['wide', 'full', 'left', 'center', 'right'];
    const classNames = className.split(' ');
    for (const align of aligns) {
        if (classNames.includes('align' + align)) {
            return align;
        }
    }
}

export { 
    getAlignFromBlockProps
}