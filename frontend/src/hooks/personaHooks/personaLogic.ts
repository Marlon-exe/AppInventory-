import { usePersonaTable } from './tableHook';
import { usePersonaForm } from './formModalHook';

export const usePersonaLogic = () => {
    const table = usePersonaTable();
    const form = usePersonaForm(table.refreshPersonas);


    return {
        personas: table.personas,
        loading: table.loading,

        isFormOpen: form.isFormOpen,
        isEditing: form.isEditing,
        form: form.form,
        setForm: form.setForm,
        departamentos: form.departamentos,
        loadingCedula: form.loadingCedula,       
        handleCedulaBlur: form.handleCedulaBlur,
        handleCreateOpen: form.handleCreateOpen,
        isNotFoundOpen: form.isNotFoundOpen,       
        setIsNotFoundOpen: form.setIsNotFoundOpen,

        handleEdit: form.handleEdit,
        handleFormClose: form.handleFormClose,
        handleFormSave: form.handleFormSave,

        isDeleteOpen: form.isDeleteOpen,
        handleDelete: form.handleDelete,
        handleDeleteClose: form.handleDeleteClose,
        handleDeleteConfirm: form.handleDeleteConfirm,
    };
};