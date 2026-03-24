import { useState, useEffect } from 'react';
import { PersonaService } from '@/src/api/services/personaService';
import { DepartamentoService } from '@/src/api/services/departamentoServices';
import { ConsultaService } from '@/src/api/services/consultaService';
interface PersonaForm {
    nombre: string;
    cedula: string;
    id_departamento: number;
}

export const usePersonaForm = (refresh: (newId?: number) => Promise<void>) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [departamentos, setDepartamentos] = useState<any[]>([]);
    const [loadingCedula, setLoadingCedula] = useState(false);
    const [form, setForm] = useState<PersonaForm>({
        nombre: '',
        cedula: '',
        id_departamento: 0,
    });

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const [isNotFoundOpen, setIsNotFoundOpen] = useState(false);

    useEffect(() => {
        DepartamentoService.getAll().then(setDepartamentos);
    }, []);

    // busca cedula y llena nombre
    const handleCedulaBlur = async () => {
        if (!form.cedula.trim() || isEditing) return;
        try {
            setLoadingCedula(true);
            const data = await ConsultaService.getByConsulta(form.cedula);
            if (data) {
                setForm(prev => ({ ...prev, nombre: data.nombre }));
            }
        } catch (error) {
            console.error("Error consultando cédula:", error);
        } finally {
            setLoadingCedula(false);
        }
    };

    const handleCreateOpen = async (cedulaInicial?: string) => {
        setIsEditing(false);
        setSelectedRow(null);
        setForm({ nombre: '', cedula: cedulaInicial ?? '', id_departamento: 0 });

        if (cedulaInicial) {
            try {
                setLoadingCedula(true);
                const data = await ConsultaService.getByConsulta(cedulaInicial);
                if (!data) {
                    setIsNotFoundOpen(true);
                    return;
                }
                setForm({ nombre: data.nombre, cedula: data.cedula, id_departamento: 0 });
            } catch (e) {
                console.error(e);
                setLoadingCedula(false);
                return;
            } finally {
                setLoadingCedula(false);
            }
        }

        setIsFormOpen(true);
    };

    const handleEdit = (row: any) => {
        setIsEditing(true);
        setSelectedRow(row);
        setForm({
            nombre: row.nombre,
            cedula: row.cedula,
            id_departamento: row.id_departamento,
        });
        setIsFormOpen(true);
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        setSelectedRow(null);
    };

    const handleFormSave = async () => {
        if (!form.nombre.trim() || !form.cedula.trim() || !form.id_departamento) return;
        try {
            if (isEditing && selectedRow) {
                await PersonaService.update(String(selectedRow.id_persona), form);
            } else {
                const res = await PersonaService.create(form);
                handleFormClose();
                await refresh(res.data?.id_persona);
                return;
            }
            handleFormClose();
            await refresh();
        } catch (error) {
            console.error("Error al guardar persona:", error);
        }
    };

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
            await PersonaService.delete(String(selectedRow.id_persona));
            handleDeleteClose();
            await refresh();
        } catch (error) {
            console.error("Error al eliminar persona:", error);
        }
    };

    return {
        isFormOpen,
        isEditing,
        form,
        setForm,
        departamentos,
        loadingCedula,
        handleCedulaBlur,
        handleCreateOpen,
        handleEdit,
        handleFormClose,
        handleFormSave,
        isDeleteOpen,
        isNotFoundOpen,
        setIsNotFoundOpen,

        handleDelete,
        handleDeleteClose,
        handleDeleteConfirm,
    };
};