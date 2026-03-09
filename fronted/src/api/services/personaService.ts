import { ENDPOINTS } from "../endpoints";

export const PersonaService = {
    getAll: async () => {
        const res = await fetch(ENDPOINTS.PERSONAS.GET_ALL);
        const json = await res.json();
        return json.data;
    },

    getById: async (id: string) => {
        const res = await fetch(ENDPOINTS.PERSONAS.BY_ID(id));
        const json = await res.json();
        return json.data;
    },

    create: async (data: { nombre: string; cedula: string; id_departamento: number }) => {
        const res = await fetch(ENDPOINTS.PERSONAS.CREATE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return res.json();
    },

    update: async (id: string, data: { nombre: string; cedula: string; id_departamento: number }) => {
        const res = await fetch(ENDPOINTS.PERSONAS.UPDATE(id), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return res.json();
    },

    delete: async (id: string) => {
        const res = await fetch(ENDPOINTS.PERSONAS.DELETE(id), {
            method: 'DELETE',
        });
        return res.json();
    },
};