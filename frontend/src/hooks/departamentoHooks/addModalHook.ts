import { useState } from 'react';
import { DepartamentoService } from '@/src/api/services/departamentoServices';

export const useDepartamentoCreate = (refresh: () => Promise<void>) => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [createForm, setCreateForm] = useState({ nom_departamento: '' });

    const handleCreateOpen = () => {
        setCreateForm({ nom_departamento: '' });
        setIsCreateOpen(true);
    };

    const handleCreateClose = () => setIsCreateOpen(false);

    const handleCreateSave = async () => {
        if (!createForm.nom_departamento.trim()) return;
        try {
            await DepartamentoService.create(createForm);
            handleCreateClose();
            await refresh();
        } catch (error) {
            console.error("Error al crear departamento:", error);
        }
    };

    return {
        isCreateOpen,
        createForm,
        setCreateForm,
        handleCreateOpen,
        handleCreateClose,
        handleCreateSave,
    };
};