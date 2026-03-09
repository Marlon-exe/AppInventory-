import { useState } from 'react';
import { CatalogoService } from '@/src/api/services/catalogoService';

export const useCatalogoSearch = () => {
    const [productos, setProductos] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [totalItems, setTotalItems] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);

    const buscar = async (valor: string) => {
        if (!valor.trim()) return;
        setLoading(true);
        try {
            const res = await CatalogoService.getProductos(valor);
            setProductos(res.data.productos);
            setTotalItems(res.data.totalItems);
            setTotalPaginas(res.data.totalPaginas);
        } catch (error) {
            console.error('Error al buscar productos:', error);
        } finally {
            setLoading(false);
        }
    };

    return { productos, loading, busqueda, setBusqueda, buscar, totalItems, totalPaginas };
};