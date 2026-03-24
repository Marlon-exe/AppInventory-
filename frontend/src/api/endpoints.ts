const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export const ENDPOINTS = {
  ENTREGAS: {
    CREATE: `${BASE_URL}/producto-entregado`,
    METRICAS: (inicio: string, fin: string) =>
      `${BASE_URL}/producto-entregado/stats?inicio=${inicio}&fin=${fin}`,
    BY_ID: (id: string) => `${BASE_URL}/producto-entregado/${id}`,
    PAGINADO: (page: number, limit: number, inicio?: string, fin?: string) => {
      let url = `${BASE_URL}/producto-entregado?page=${page}&limit=${limit}`;
      if (inicio && fin) url += `&inicio=${inicio}&fin=${fin}`;
      return url;
    }
  },
  PRODUCTOS: {
    GET_ALL: `${BASE_URL}/producto`,
    BY_ID: (id: string) => `${BASE_URL}/producto/${id}`,
    CREATE: `${BASE_URL}/producto`,
    UPDATE: (id: string) => `${BASE_URL}/producto/${id}`,
    DELETE: (id: string) => `${BASE_URL}/producto/${id}`,
  },
  PERSONAS: {
    GET_ALL: `${BASE_URL}/persona`,
    BY_ID: (id: string) => `${BASE_URL}/persona/${id}`,
    CREATE: `${BASE_URL}/persona`,
    UPDATE: (id: string) => `${BASE_URL}/persona/${id}`,
    DELETE: (id: string) => `${BASE_URL}/persona/${id}`,
  },
  DEPARTAMENTOS: {
    GET_ALL: `${BASE_URL}/departamento`,
    BY_ID: (id: string) => `${BASE_URL}/departamento/${id}`,
    CREATE: `${BASE_URL}/departamento`,
    UPDATE: (id: string) => `${BASE_URL}/departamento/${id}`,
    DELETE: (id: string) => `${BASE_URL}/departamento/${id}`,
  },
  CATALOGO: {
    PRODUCTOS: (valor: string) => `${BASE_URL}/catalogo?valor=${encodeURIComponent(valor)}`,
    DETALLE: (url: string) => `${BASE_URL}/catalogo/detalle?url=${encodeURIComponent(url)}`,
  },

  CONSULTA: (cedula: string) =>
    `https://servicios.portoviejo.gob.ec:27514/catastro/api/datospersonacedula?persona.cedularuc=${cedula}`,

  IMAGE: (cedula: string) =>
    `https://servicios.portoviejo.gob.ec:27514/dinardap/api/imagencedula?persona.cedularuc=${cedula}`,
}
