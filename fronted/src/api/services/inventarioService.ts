import { ENDPOINTS } from "../endpoints";

export const ProductoService = {
    getAll: async () => {
        const res = await fetch(ENDPOINTS.PRODUCTOS.GET_ALL);
        const json = await res.json();
        return json.data;
    },

    getById: async (id: string) => {
        const res = await fetch(ENDPOINTS.PRODUCTOS.BY_ID(id));
        const json = await res.json();
        return json.data;
    },

    create: async (data: { tipo_producto: string }) => {
        const res = await fetch(ENDPOINTS.PRODUCTOS.CREATE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return res.json();
    },

    update: async (id: string, data: { tipo_producto: string }) => {
        const res = await fetch(ENDPOINTS.PRODUCTOS.UPDATE(id), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return res.json();
    },

    delete: async (id: string) => {
        const res = await fetch(ENDPOINTS.PRODUCTOS.DELETE(id), {
            method: 'DELETE',
        });
        return res.json();
    },
};