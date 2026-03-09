import { useState } from 'react';
import { EntregasService } from '../../api/services/entregaService';

interface EditForm {
    cantidad: string;
    fecha_entrega: string;
    quien_entrega: string;
    quien_retiro: string;
    id_persona_entrega: number;
    id_persona_retiro: number;
}

export const useEditLogic = (refreshTable: () => Promise<void>) => {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<any>(null);

    const [editForm, setEditForm] = useState<EditForm>({
        cantidad: '',
        fecha_entrega: '',
        quien_entrega: '',
        quien_retiro: '',
        id_persona_entrega: 0,
        id_persona_retiro: 0,
    });

    const handleEdit = (row: any) => {
        setSelectedRow(row);
        setEditForm({
            cantidad: String(row.cantidad),
            fecha_entrega: row.fecha,
            quien_entrega: row.quien_entrega,
            quien_retiro: row.quien_retiro,
            id_persona_entrega: row.id_persona_entrega,
            id_persona_retiro: row.id_persona_retiro,
        });
        setIsEditOpen(true);
    };

    const handleEditClose = () => {
        setIsEditOpen(false);
        setSelectedRow(null);
    };

    const handleEditSave = async () => {
        if (!selectedRow) return;
        try {
            await EntregasService.update(selectedRow.id_producto_entregado, {
                cantidad: Number(editForm.cantidad),
                fecha_entrega: editForm.fecha_entrega,
                id_persona_entrega: editForm.id_persona_entrega,
                id_persona_retiro: editForm.id_persona_retiro,
            });
            handleEditClose();
            await refreshTable();
        } catch (error) {
            console.error("Error al editar:", error);
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