import { json } from "stream/consumers";
import { ENDPOINTS } from "../endpoints";

export const ConsultaService = {
    getByConsulta: async (cedula: string) => {
        try {
            const res = await fetch(ENDPOINTS.CONSULTA(cedula));
            const json = await res.json();

            if (json.Resultado !== 'OK') return null;

            const datos = json.Datos;
            const get = (nombre: string) => datos.find((d: any) =>
                d.Nombre == nombre).Valor ?? '';

            return {
                cedula: get('cedularuc'),
                nombre: get('nombre'),
            };
        } catch (error) {

        }
    },

    getContenComplet: async (cedula: string) => {
        try {

            //consulta de datos
            const res = await fetch(ENDPOINTS.CONSULTA(cedula));
            const json = await res.json();

            if (json.Resultado !== 'OK' || !json.Datos) return null

            const datos = json.Datos;

            const get = (nombre: string) => {
                const campo = datos.find((d: any) =>
                    d.Nombre.trim().toLowerCase() === nombre.toLowerCase()
                );
                return campo?.Valor ?? '';
            };

            //llamada a imagen
            const resImg = await fetch(ENDPOINTS.IMAGE(cedula));
            const jsonImg = await resImg.json();

            const formatImg = (raw: any) =>
                (raw && raw.trim().length > 10) ? `data:image/jpeg;base64,${raw}` : null;

            let fotoBase64 = null;
            let firmaBase64 = null;

            if (jsonImg.Resultado === 'OK' && jsonImg.Datos) {
                const imgDatos = jsonImg.Datos;

                fotoBase64 = formatImg(imgDatos.find((d: any) => d.Nombre === 'foto')?.Valor);
                firmaBase64 = formatImg(imgDatos.find((d: any) => d.Nombre === 'firma')?.Valor);
            }
            //conyuge
            const ci_conyuge = get('Conyuge');
            let conyugeData = null;
            if (ci_conyuge) {
                const resC = await fetch(ENDPOINTS.CONSULTA(ci_conyuge));
                const jsonC = await resC.json();

                if (jsonC.Resultado == 'OK') {
                    const dC = jsonC.Datos;
                    const getC = (nombre: string) => dC.find((d: any) => d.Nombre === nombre)?.Valor ?? '';

                    conyugeData = {
                        cedula: getC('cedularuc'),
                        nombre: getC('nombre'),
                        email: getC('email'),
                        fecha_nac: getC('FechaNacimiento'),
                        discapacidad: getC('Discapacidad'),
                        porcen_disc: getC('PorcentajeDiscapacidad')
                    };
                }
            }
            return {
                cedula: get('cedularuc'),
                nombre: get('nombre'),
                direccion: get('direccion') || get('domicilio') || 'No registrada', email: get('email'),
                estado_cuenta: get('estadocuenta'),
                cambiar_password: get('cambiarpassword'),
                fecha_nac: get('FechaNacimiento').split(' ')[0],
                discapacidad: get('Discapacidad'),
                porcen_disc: get('PorcentajeDiscapacidad'),
                conyuge: conyugeData,
                foto: fotoBase64,
                firma: firmaBase64,
                estado_civil: get('EstadoCivil') || 'N/A'
            }
        } catch (error) {
            console.error("Error en el servicio:", error);
            return null;
        }
    }
};

