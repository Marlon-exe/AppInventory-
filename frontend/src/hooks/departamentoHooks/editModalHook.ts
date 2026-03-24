import { useState } from 'react';
import { DepartamentoService } from '@/src/api/services/departamentoServices';

export const useDepartamentoEdit = (refresh: () => Promise<void>) => {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const [editForm, setEditForm] = useState({ nom_departamento: '' });

    const handleEdit = (row: any) => {
        setSelectedRow(row);
        setEditForm({ nom_departamento: row.nom_departamento });
        setIsEditOpen(true);
    };

    const handleEditClose = () => {
        setIsEditOpen(false);
        setSelectedRow(null);
    };

    const handleEditSave = async () => {
        if (!selectedRow) return;
        try {
            await DepartamentoService.update(String(selectedRow.id_departamento), editForm);
            handleEditClose();
            await refresh();
        } catch (error) {
            console.error("Error al editar departamento:", error);
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