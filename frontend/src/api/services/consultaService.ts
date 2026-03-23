import { ENDPOINTS } from "../endpoints";

export const ConsultaService = {
    getByConsulta: async (cedula: string) => {
        const res = await fetch(ENDPOINTS.CONSULTA(cedula));
        const json = await res.json();

        if (json.Resultado !== 'OK') return null;

        const datos = json.Datos;
        const get = (nombre: string) => datos.find((d: any) => d.Nombre == nombre).Valor ?? '';

        return {
            cedula: get('cedularuc'),
            nombre: get('nombre'),
        };
    }
};