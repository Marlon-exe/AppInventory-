//interfaces para las respuestas del servidor 

//Respuetsas para la informacion de las barras
export interface Entrega {
    producto: string;
    cantidad: number;
    fecha: string;
}

export interface Producto {
    tipo_producto: string;
}


//respuestas para la informacion de las tablas 
export interface RegistroEntrega {
    id_producto_entregado: number;
    id_producto: number;       
    id_persona_retiro: number;   
    id_persona_entrega: number;   
    cantidad: number;
    fecha: string; //'yy-mm-dd'
    quien_retiro: string;
    quien_entrega: string;
    producto: string;
    departamento: string;
}

export interface ApiResponseEntregas {
    msg: string;
    value: boolean;
    data: {
        registros: RegistroEntrega[];
        total: number;
        paginas: number,
        paginaActual: number;
    };
}



//funcion que procesa la fecha por semana
export const transformarDatosParaGrafico = (productosAPI: any[], entregasAPI: any[]) => {

    const tipo_producto = productosAPI.map(p => p.tipo_producto);


    const registrosPorDia: Record<string, any> = {};

    entregasAPI.forEach((entrega) => {
        //  'YYYY-MM-DD'
        const fecha = entrega.fecha;

        if (!registrosPorDia[fecha]) {
            registrosPorDia[fecha] = { name: fecha };
            tipo_producto.forEach(n => registrosPorDia[fecha][n] = 0);
        }

        if (registrosPorDia[fecha].hasOwnProperty(entrega.producto)) {
            registrosPorDia[fecha][entrega.producto] += entrega.cantidad;
        }
    });


    const datosGraficos = Object.values(registrosPorDia).sort((a, b) =>
        new Date(a.name).getTime() - new Date(b.name).getTime()
    );

    return {
        datosGraficos,
        tipo_producto
    };
};