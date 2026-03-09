import { ENDPOINTS } from "../endpoints";

export const EntregasService = {
    getMetricas: async (inicio: string, fin: string) => {
        const res = await fetch(ENDPOINTS.ENTREGAS.METRICAS(inicio, fin));
        const json = await res.json();
        return json.data;
    },

    //Este es optine las paginaciones
    getAll: async (page = 1, limit = 10, inicio?: string, fin?: string) => {
        const res = await fetch(ENDPOINTS.ENTREGAS.PAGINADO(page, limit, inicio, fin));
        const json = await res.json();
        return json.data;
    },

    getById: async (id: string) => {
        const res = await fetch(ENDPOINTS.ENTREGAS.BY_ID(id));
        const json = await res.json()
        return json.data
    },

    create: async (data: {
        id_persona_retiro: number;
        id_persona_entrega: number;
        id_producto: number;
        cantidad: number;
        fecha_entrega?: string;
    }) => {
        const res = await fetch(ENDPOINTS.ENTREGAS.CREATE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json()
    },
    update: async (id: string, data: Partial<{
        id_persona_retiro: number;
        id_persona_entrega: number;
        id_producto: number;
        cantidad: number;
        fecha_entrega: string;
    }>) => {
        const res = await fetch(ENDPOINTS.ENTREGAS.BY_ID(id), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },
    delete: async (id: string) => {
        const res = await fetch(ENDPOINTS.ENTREGAS.BY_ID(id), {
            method: 'DELETE'
        });
        return res.json();
    },

    //Este es para generar los reportes mensuales 
    getAllReport: async (incio?: string, fin?: string) => {
        const res = await fetch(ENDPOINTS.ENTREGAS.PAGINADO(1, 9999, incio, fin));
        const json = await res.json();
        return json.data.registros ?? [];
    }

};