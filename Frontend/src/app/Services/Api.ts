import axios, { AxiosResponse } from 'axios';

const clienteAxios = axios.create({
  baseURL: 'http://localhost:8080',
});

export interface Empresa {
  id: number;
  codEmpresa: string;
  empresaNombre: string;
}

export interface Cotizacion {
  id: string;
  fecha: string;
  hora: string;
  cotizacion: number; // Cotización debe ser un número para realizar cálculos
  codEmpresaFK: {
    codEmpresa: string;
  };
}

export interface CotizacionIndice {
  id: number;
  fecha: string;
  hora: string;
  valorCotizacionIndice: number; // Cotización debe ser un número para realizar cálculos
  codigoIndice: Indice;
}

export interface Indice {
  id: number;
  codigoIndice: string;
  nombreIndice: string;
  valorFinalIndice: number; // Cotización debe ser un número para realizar cálculos
  cotizaciones: CotizacionIndice[];
}

export const obtenerCotizaciones = async (): Promise<Cotizacion[]> => {
  try {
    const response: AxiosResponse<Cotizacion[]> = await clienteAxios.get('/cotizaciones');
    const datosConvertidos = response.data.map(cot => ({
      ...cot,
      cotizacion: parseFloat(cot.cotizacion as unknown as string),
    }));
    return datosConvertidos;
  } catch (error) {
    console.error('API: Error al obtener cotizaciones:', error);
    return [];
  }
};

export const obtenerEmpresas = async (): Promise<Empresa[]> => {
  try {
    const response: AxiosResponse<Empresa[]> = await clienteAxios.get('/empresas');
    return response.data;
  } catch (error) {
    console.error('API: Error al obtener empresas:', error);
    return [];
  }
}

export const cotizacionesIndice = async (): Promise<CotizacionIndice[]> => {
  try {
    const response: AxiosResponse<CotizacionIndice[]> = await clienteAxios.get('/cotizacionIndice');
    return response.data;
  } catch (error) {
    console.error('API: Error al obtener CotizacionIndice:', error);
    return [];
  }
};