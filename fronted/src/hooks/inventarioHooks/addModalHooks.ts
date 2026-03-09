import { useState } from 'react';
import { ProductoService } from '@/src/api/services/inventarioService';

interface CreateForm {
    tipo_producto: string;
}

export const useProductoCreate = (refresh: () => Promise<void>) => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [createForm, setCreateForm] = useState<CreateForm>({ tipo_producto: '' });

    const handleCreateOpen = () => {
        setCreateForm({ tipo_producto: '' });
        setIsCreateOpen(true);
    };

    const handleCreateClose = () => {
        setIsCreateOpen(false);
    };

    const handleCreateSave = async () => {
        if (!createForm.tipo_producto.trim()) return;
        try {
            await ProductoService.create(createForm);
            handleCreateClose();
            await refresh()
        } catch (error) {
            console.error("Error al crear el prodcuto", error);
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