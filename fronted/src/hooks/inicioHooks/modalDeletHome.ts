import { useState } from 'react';
import { EntregasService } from '../../api/services/entregaService';

export const useDeleteLogic = (refreshTable: () => Promise<void>) => {
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<any>(null);

    const handleDelete = (row: any) => {
        setSelectedRow(row);
        setIsDeleteOpen(true);
    };

    const handleDeleteClose = () => {
        setIsDeleteOpen(false);
        setSelectedRow(null);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedRow) return;
        try {
            await EntregasService.delete(selectedRow.id_producto_entregado);
            handleDeleteClose();
            await refreshTable();
        } catch (error) {
            console.error("Error eliminando:", error);
        }
    };

    return {
        isDeleteOpen,
        selectedRow,
        handleDelete,
        handleDeleteClose,
        handleDeleteConfirm,
    };
};