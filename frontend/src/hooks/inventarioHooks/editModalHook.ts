import { useState } from 'react';
import { ProductoService } from '@/src/api/services/inventarioService';

interface EditForm {
    tipo_producto: string;
}

export const useProductoEdit = (refresh: () => Promise<void>) => {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const [editForm, setEditForm] = useState<EditForm>({ tipo_producto: '' });

    const handleEdit = (row: any) => {
        setSelectedRow(row);
        setEditForm({ tipo_producto: row.tipo_producto });
        setIsEditOpen(true);
    };

    const handleEditClose = () => {
        setIsEditOpen(false);
        setSelectedRow(null);
    };

    const handleEditSave = async () => {
        if (!selectedRow) return;
        try {
            await ProductoService.update(selectedRow.id_producto, editForm);
            handleEditClose();
            await refresh();
        } catch (error) {
            console.error("Error al editar producto:", error);
        }
    };

    return {
        isEditOpen,
        editForm,
        setEditForm,
        handleEdit,
        handleEditClose,
        handleEditSave,
    };
};