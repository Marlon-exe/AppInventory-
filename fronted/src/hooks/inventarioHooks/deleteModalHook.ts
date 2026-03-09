import { useState } from 'react';
import { ProductoService } from '@/src/api/services/inventarioService';

export const useProductoDelete = (refresh: () => Promise<void>) => {
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
            await ProductoService.delete(String(selectedRow.id_producto));
            handleDeleteClose();
            await refresh();
        } catch (error) {
            console.error("Error al eliminar producto:", error);
        }
    };

    return {
        isDeleteOpen,
        handleDelete,
        handleDeleteClose,
        handleDeleteConfirm,
    };
};