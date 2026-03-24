import { useState } from 'react';
import { ConsultaService } from '@/src/api/services/consultaService';

export const usePersonaLogic = () => {
    const [persona, setPersona] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [error, setError] = useState<string | null>(null);

    const buscarPersona = async (cedula: string) => {
        if (!cedula.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const data = await ConsultaService.getContenComplet(cedula);
            if (data) {
                setPersona(data);
            } else {
                setError("No se encontró información");
            }
        } catch (err) {
            console.error(err);
            setError("Error en la consulta");
        } finally {
            setLoading(false);
        }
    };

    const cerrarDetalle = () => setPersona(null);

    return {
        persona,
        loading,
        busqueda,
        setBusqueda,
        buscarPersona,
        cerrarDetalle,
        error
    };
};