import { ENDPOINTS } from "../endpoints";

export const DepartamentoService = {
    getAll: async () => {
        const res = await fetch(ENDPOINTS.DEPARTAMENTOS.GET_ALL);
        const json = await res.json();
        return json.data;
    },

    getById: async (id: string) => {
        const res = await fetch(ENDPOINTS.DEPARTAMENTOS.BY_ID(id));
        const json = await res.json();
        return json.data;
    },

    create: async (data: { nom_departamento: string }) => {
        const res = await fetch(ENDPOINTS.DEPARTAMENTOS.CREATE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return res.json();
    },

    update: async (id: string, data: { nom_departamento: string }) => {
        const res = await fetch(ENDPOINTS.DEPARTAMENTOS.UPDATE(id), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return res.json();
    },

    delete: async (id: string) => {
        const res = await fetch(ENDPOINTS.DEPARTAMENTOS.DELETE(id), {
            method: 'DELETE',
        });
        return res.json();
    },
};