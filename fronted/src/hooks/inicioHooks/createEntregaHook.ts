import { useState, useEffect } from 'react';
import { EntregasService } from '@/src/api/services/entregaService';
import { PersonaService } from '@/src/api/services/personaService';
import { ProductoService } from '@/src/api/services/inventarioService';
import { usePersonaForm } from '@/src/hooks/personaHooks/formModalHook';
import { today, getLocalTimeZone } from "@internationalized/date";

interface EntregaForm {
    id_persona_retiro: number;
    id_persona_entrega: number;
    id_producto: number;
    cantidad: string;
    fecha_entrega: string;
}

export const useEntregaCreate = (refresh: () => Promise<void>) => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [personas, setPersonas] = useState<any[]>([]);
    const [productos, setProductos] = useState<any[]>([]);
    const [form, setForm] = useState<EntregaForm>({
        id_persona_retiro: 0,
        id_persona_entrega: 0,
        id_producto: 0,
        cantidad: '',
        fecha_entrega: today(getLocalTimeZone()).toString(),
    });

    const personaForm = usePersonaForm(async (newPersonaId?: number) => {
        const data = await PersonaService.getAll();
        setPersonas(data);
        if (newPersonaId) {
            setForm(prev => ({ ...prev, id_persona_retiro: newPersonaId }));
        }
    });

    const fetchData = async () => {
        const [p, prod] = await Promise.all([
            PersonaService.getAll(),
            ProductoService.getAll(),
        ]);
        setPersonas(p);
        setProductos(prod);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateOpen = () => {
        setForm({
            id_persona_retiro: 0,
            id_persona_entrega: 0,
            id_producto: 0,
            cantidad: '',
            fecha_entrega: today(getLocalTimeZone()).toString()
        });
        setIsCreateOpen(true);
    };

    const handleCreateClose = () => setIsCreateOpen(false);

    const handleCreateSave = async () => {
        if (!form.id_persona_retiro || !form.id_persona_entrega || !form.id_producto || !form.cantidad) return;
        try {
            await EntregasService.create({
                id_persona_retiro: form.id_persona_retiro,
                id_persona_entrega: form.id_persona_entrega,
                id_producto: form.id_producto,
                cantidad: Number(form.cantidad),
                fecha_entrega: form.fecha_entrega || undefined,
            });
            handleCreateClose();
            await refresh();
        } catch (error) {
            console.error("Error al crear entrega:", error);
        }
    };

    return {
        isCreateOpen,
        form,
        setForm,
        personas,
        productos,
        handleCreateOpen,
        handleCreateClose,
        handleCreateSave,
        personaForm,
    };
};