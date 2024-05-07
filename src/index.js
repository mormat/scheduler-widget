/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './style.scss';

/**
 * Internal dependencies
 */
import Edit from './edit';
import save from './save';
import metadata from './block.json';

const schedulerIcon = (
    <svg viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false">
        
        <g>
            <rect x="119.256" y="222.607" class="st0" width="50.881" height="50.885"/>
            <rect x="341.863" y="222.607" class="st0" width="50.881" height="50.885"/>
            <rect x="267.662" y="222.607" class="st0" width="50.881" height="50.885"/>
            <rect x="119.256" y="302.11" class="st0" width="50.881" height="50.885"/>
            <rect x="267.662" y="302.11" class="st0" width="50.881" height="50.885"/>
            <rect x="193.46" y="302.11" class="st0" width="50.881" height="50.885"/>
            <rect x="341.863" y="381.612" class="st0" width="50.881" height="50.885"/>
            <rect x="267.662" y="381.612" class="st0" width="50.881" height="50.885"/>
            <rect x="193.46" y="381.612" class="st0" width="50.881" height="50.885"/>
            <path class="st0" d="M439.277,55.046h-41.376v39.67c0,14.802-12.195,26.84-27.183,26.84h-54.025
                    c-14.988,0-27.182-12.038-27.182-26.84v-39.67h-67.094v39.297c0,15.008-12.329,27.213-27.484,27.213h-53.424
                    c-15.155,0-27.484-12.205-27.484-27.213V55.046H72.649c-26.906,0-48.796,21.692-48.796,48.354v360.246
                    c0,26.661,21.89,48.354,48.796,48.354h366.628c26.947,0,48.87-21.692,48.87-48.354V103.4
                    C488.147,76.739,466.224,55.046,439.277,55.046z M453.167,462.707c0,8.56-5.751,14.309-14.311,14.309H73.144
                    c-8.56,0-14.311-5.749-14.311-14.309V178.089h394.334V462.707z"/>
            <path class="st0" d="M141.525,102.507h53.392c4.521,0,8.199-3.653,8.199-8.144v-73.87c0-11.3-9.27-20.493-20.666-20.493h-28.459
                    c-11.395,0-20.668,9.192-20.668,20.493v73.87C133.324,98.854,137.002,102.507,141.525,102.507z"/>
            <path class="st0" d="M316.693,102.507h54.025c4.348,0,7.884-3.513,7.884-7.826V20.178C378.602,9.053,369.474,0,358.251,0H329.16
                    c-11.221,0-20.349,9.053-20.349,20.178v74.503C308.81,98.994,312.347,102.507,316.693,102.507z"/>
        </g>
    </svg>
);

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType( metadata.name, {
    
        icon: schedulerIcon,
    
	/**
	 * @see ./edit.js
	 */
	edit: Edit,

	/**
	 * @see ./save.js
	 */
	save,
} );
