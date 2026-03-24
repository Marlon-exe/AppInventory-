import { useState, useEffect } from 'react';
import { ProductoService } from '@/src/api/services/inventarioService';

export const useProductoTable = () => {
    const [productos, setProductos] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchProductos = async () => {
        try {
            setLoading(true);
            const data = await ProductoService.getAll();
            setProductos(data);
        } catch (error) {
            console.error("Error cargando productos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductos();
    }, []);

    return {
        productos,
        loading,
        refreshProductos: fetchProductos,
    };
};