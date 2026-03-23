import { useState } from 'react';
import { CatalogoService } from '@/src/api/services/catalogoService';

export const useCatalogoDetalle = () => {
    const [isDetalleOpen, setIsDetalleOpen] = useState(false);
    const [detalle, setDetalle] = useState<Record<string, string> | null>(null);
    const [loadingDetalle, setLoadingDetalle] = useState(false);
    const [nombreProducto, setNombreProducto] = useState('');

    const handleVerDetalle = async (row: any) => {
        setIsDetalleOpen(true);
        setDetalle(null);
        setNombreProducto(row.nombre);
        setLoadingDetalle(true);
        try {
            const res = await CatalogoService.getDetalleProducto(row.url);
            setDetalle(res.data);
        } catch (error) {
            console.error('Error al obtener detalle:', error);
        } finally {
            setLoadingDetalle(false);
        }
    };

    const handleDetalleClose = () => {
        setIsDetalleOpen(false);
        setDetalle(null);
        setNombreProducto('');
    };

    return { isDetalleOpen, detalle, loadingDetalle, nombreProducto, handleVerDetalle, handleDetalleClose };
};