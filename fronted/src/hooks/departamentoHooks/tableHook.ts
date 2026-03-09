import { useState, useEffect } from 'react';
import { DepartamentoService } from '@/src/api/services/departamentoServices';

export const useDepartamentoTable = () => {
    const [departamentos, setDepartamentos] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchDepartamentos = async () => {
        try {
            setLoading(true);
            const data = await DepartamentoService.getAll();
            setDepartamentos(data);
        } catch (error) {
            console.error("Error cargando departamentos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartamentos();
    }, []);

    return {
        departamentos,
        loading,
        refreshDepartamentos: fetchDepartamentos,
    };
};