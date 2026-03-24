import { useProductoTable } from './tableHook';
import { useProductoCreate } from './addModalHooks';
import { useProductoEdit } from './editModalHook';
import { useProductoDelete } from './deleteModalHook';

export const useProductoLogic = () => {
    const table = useProductoTable();
    const create = useProductoCreate(table.refreshProductos);
    const edit = useProductoEdit(table.refreshProductos);
    const delet = useProductoDelete(table.refreshProductos);

    return {
        // table
        productos: table.productos,
        loading: table.loading,

        //create
        isCreateOpen: create.isCreateOpen,
        createForm: create.createForm,
        setCreateForm: create.setCreateForm,
        handleCreateOpen: create.handleCreateOpen,
        handleCreateClose: create.handleCreateClose,
        handleCreateSave: create.handleCreateSave,

        // edit
        isEditOpen: edit.isEditOpen,
        editForm: edit.editForm,
        setEditForm: edit.setEditForm,
        handleEdit: edit.handleEdit,
        handleEditClose: edit.handleEditClose,
        handleEditSave: edit.handleEditSave,

        // delete
        isDeleteOpen: delet.isDeleteOpen,
        handleDelete: delet.handleDelete,
        handleDeleteClose: delet.handleDeleteClose,
        handleDeleteConfirm: delet.handleDeleteConfirm,
    };
};