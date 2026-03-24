import { useState, useEffect } from 'react';
import { PersonaService } from '@/src/api/services/personaService';

export const usePersonaTable = () => {
    const [personas, setPersonas] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchPersonas = async () => {
        try {
            setLoading(true);
            const data = await PersonaService.getAll();
            setPersonas(data);
        } catch (error) {
            console.error("Error cargando personas:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPersonas();
    }, []);

    return { personas, loading, refreshPersonas: fetchPersonas };
};