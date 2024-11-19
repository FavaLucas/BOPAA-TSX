import axios, { AxiosResponse } from 'axios';

const clienteAxios = axios.create({
  baseURL: 'http://localhost:8080',
});

interface Empresa {
  id: number;
  codEmpresa: string;
  empresaNombre: string;
}

interface Cotizacion {
  id: string;
  fecha: string;
  hora: string;
  cotizacion: number; // Cotización debe ser un número para realizar cálculos
  codEmpresaFK: {
    codEmpresa: string;
  };
}

export const obtenerCotizaciones = async (): Promise<Cotizacion[]> => {
  try {
    const response: AxiosResponse<Cotizacion[]> = await clienteAxios.get('/cotizaciones');
    console.log('API: Respuesta completa de la API - Cotizaciones:', response);
    console.log('API: Respuesta de la API - Cotizaciones:', response.data);
    const datosConvertidos = response.data.map(cot => ({
      ...cot,
      cotizacion: parseFloat(cot.cotizacion as unknown as string),
    }));
    console.log('API: Datos convertidos - Cotizaciones:', datosConvertidos);
    return datosConvertidos;
  } catch (error) {
    console.error('API: Error al obtener cotizaciones:', error);
    return [];
  }
};

export const obtenerEmpresas = async (): Promise<Empresa[]> => {
  try {
    const response: AxiosResponse<Empresa[]> = await clienteAxios.get('/empresas');
    console.log('API: Respuesta completa de la API - Empresas:', response);
    console.log('API: Respuesta de la API - Empresas:', response.data);
    console.log('API: Datos mapeados - Empresas:', response.data);
    return response.data;
  } catch (error) {
    console.error('API: Error al obtener empresas:', error);
    return [];
  }
};
