import { ENDPOINTS } from '@/src/api/endpoints';

export const CatalogoService = {
    getProductos: async (valor: string) => {
        const res = await fetch(ENDPOINTS.CATALOGO.PRODUCTOS(valor));
        if (!res.ok) throw new Error('Error al buscar productos');
        return res.json();
    },

    getDetalleProducto: async (url: string) => {
        const ruta = url.match(/\/producto\/[^/]+$/)?.[0];
        if (!ruta) throw new Error('URL no válida');

        const res = await fetch(ENDPOINTS.CATALOGO.DETALLE(ruta));
        if (!res.ok) throw new Error('Error al obtener detalle');
        return res.json();
    },
};