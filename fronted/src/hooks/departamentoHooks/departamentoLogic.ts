import { useDepartamentoTable } from './tableHook';
import { useDepartamentoCreate } from './addModalHook';
import { useDepartamentoEdit } from './editModalHook';
import { useDepartamentoDelete } from './deleteModalHook';

export const useDepartamentoLogic = () => {
    const table = useDepartamentoTable();
    const create = useDepartamentoCreate(table.refreshDepartamentos);
    const edit = useDepartamentoEdit(table.refreshDepartamentos);
    const delet = useDepartamentoDelete(table.refreshDepartamentos);

    return {
        departamentos: table.departamentos,
        loading: table.loading,

        isCreateOpen: create.isCreateOpen,
        createForm: create.createForm,
        setCreateForm: create.setCreateForm,
        handleCreateOpen: create.handleCreateOpen,
        handleCreateClose: create.handleCreateClose,
        handleCreateSave: create.handleCreateSave,

        isEditOpen: edit.isEditOpen,
        editForm: edit.editForm,
        setEditForm: edit.setEditForm,
        handleEdit: edit.handleEdit,
        handleEditClose: edit.handleEditClose,
        handleEditSave: edit.handleEditSave,

        isDeleteOpen: delet.isDeleteOpen,
        handleDelete: delet.handleDelete,
        handleDeleteClose: delet.handleDeleteClose,
        handleDeleteConfirm: delet.handleDeleteConfirm,
    };
};