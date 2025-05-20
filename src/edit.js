/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

import {
    getAlignFromBlockProps
} from './utils';

import { useEffect } from '@wordpress/element';

import { useDebounce } from "@uidotdev/usehooks";

import { useGroupsLoader } from './hooks/api';

import SchedulerInspectorControls from './components/SchedulerInspectorControls';
import SchedulerResizableBlock from './components/SchedulerResizableBlock';
import SchedulerPreview      from './components/SchedulerPreview';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes, toggleSelection } ) {
        
    const blockProps = useBlockProps({
        style: {}
    });
    
    const {
        width,
        height,
        namespace,
        ...listenedSchedulerProps
    } = attributes;
    
    const groupsLoader = useGroupsLoader({ namespace });
    
    const debouncedNamespace = useDebounce(namespace, 250);
    useEffect(() => {
        if (attributes.showGroups) {
            groupsLoader.exec();
        }
    }, [attributes.showGroups, debouncedNamespace]);
    
    const schedulerPreviewKey = JSON.stringify({
        ...listenedSchedulerProps,
        groups: groupsLoader.results
    });
    
    const isGroupsReloading = groupsLoader.isPending ||
        debouncedNamespace != namespace;
    
    return (
        <>
            
            <SchedulerInspectorControls 
                attributes    = { attributes }
                setAttributes = { setAttributes }
                blockProps    = { blockProps }
                groupsLoader  = { groupsLoader }
                isGroupsReloading = { isGroupsReloading }
            />

            <SchedulerResizableBlock
                attributes      = { attributes }
                setAttributes   = { setAttributes }
                toggleSelection = { toggleSelection }
                blockProps      = { blockProps }
            >
                <SchedulerPreview 
                    key             = { schedulerPreviewKey }
                    attributes      = { attributes }
                    blockProps      = { blockProps }
                    groups          = { groupsLoader.results }
                />   
            </SchedulerResizableBlock>

        </>      
    );
}
