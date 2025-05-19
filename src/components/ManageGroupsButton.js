import { Button, Modal, TextControl } from '@wordpress/components';
import { Icon, trash } from '@wordpress/icons';

import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

function ManageGroupsButton({
    onAsyncLoad = () => {},
    onAsyncSave = () => {},
    disabled = false
}) {
    
    const [ isOpen, setOpen ] = useState( false );
    const [rows, setRows] = useState([]);
    
    const openModal = async () => {
        const rows = await onAsyncLoad();
        setRows(rows);
        setOpen( true );
    }
    const closeModal = async function({save}) {
        setOpen( false );
        if (save) {
            await onAsyncSave(rows.filter(function(row) {
                // no need to delete an item that hasn't been created yet
                if (row['#deleted'] === true & !row['id']) {
                    return false;
                }
                return true;
            }));
        }
    }
    

    function handleAddGroupClick() {
        setRows([...rows, {id: null, label: ''}]);
    }
    
    return (
    <>
      <Button variant="link" onClick={ openModal } disabled = { disabled }>
        { __( 'Manage groups', 'scheduler-widget' ) }
      </Button>
      { isOpen && (
        <Modal 
            className="scheduler_widget_ManageGroupsModal"
            title={ __( 'Manage groups', 'scheduler-widget' ) }
            onRequestClose={ closeModal }
            size = "small"
        >
            
          <div style = { { 
              maxHeight: '240px', 
              overflow: 'auto',
          }}>
            <ManageGroupsList 
                rows    = { rows }
                setRows = { setRows }
            />
          </div>

          <p>
            <Button variant="secondary" onClick={ handleAddGroupClick }>
                { __( 'Add group', 'scheduler-widget' ) }
            </Button>
          
            <Button variant="primary" 
                    onClick={ () => closeModal({ save: true }) }
                    style = { { float: "right"}}
            >
              { __( 'Save', 'scheduler-widget' ) }
            </Button>
          </p>
                  
        </Modal>
      ) }
    </>
  );
};


function ManageGroupsList({ rows, setRows }) {
    
    function updateRow( row, index ) {
        setRows( rows.map((v,k) => k === index ? row : v) );
    }
    
    function isVisible(values) {
        if (values['#deleted'] === true) {
            return false;
        }
        return true;
    }
    
    return (
        <table 
            style = { { width: "100%" } }
        >
            { rows.map((row, index) => isVisible(row) && (
                <ManageGroupsRow 
                    key       = { index }
                    values    = { row }
                    setValues = { row => updateRow(row, index) }
                />
            )) }
        </table>
    )
}

function ManageGroupsRow( { values, setValues } ) {
    
    const mergeValues = function (newValues) {
        setValues({...values, ...newValues});
    }
    
    function handleDeleteClick() {
        const updatedValues = { ...values };
        updatedValues['#deleted'] = true;
        setValues(updatedValues);
    }
    
    return (
        <tr>
            <td>
                <TextControl
                    value    = { values.label }
                    onChange = { ( value ) =>
                        mergeValues({label: value})
                    }
                />
            </td>
            <td>
                <Button onClick = { handleDeleteClick }>
                    <Icon icon={trash} />
                </Button>
                
            </td>
        </tr>        
    )
}

export default ManageGroupsButton;