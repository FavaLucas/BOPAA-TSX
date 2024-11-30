'use client';
import { AxiosResponse } from "axios";
import { iCotizacion, iEmpresa, iCotizacionIndice, iIndice } from "../models/interfaz";
import clienteAxios from "./Axios";

// Función genérica para manejar errores
const manejarError = (error: any, mensaje: string): [] => {
  console.error(`API: ${mensaje}`, error);
  return [];
};

export const obtenerEmpresasDeDBLocal = async (): Promise<iEmpresa[]> => {
  try {
    const response: AxiosResponse<iEmpresa[]> = await clienteAxios.get('/empresas/traerDatos/DBLocalEmpresas');
    console.log("API: Empresas obtenidas desde la base de datos local:", response.data);
    return response.data;
  } catch (error) {
    return manejarError(error, "Error al obtener las empresas de la base de datos local.");
  }
};


export const obtenerCotizaciones = async (codEmpresa: string): Promise<iCotizacion[]> => {
  try {
    const response: AxiosResponse<iCotizacion[]> = await clienteAxios.get(`cotizaciones/filtrarCotdemiDB/${codEmpresa}`);

    // Convertir la cotización a número
    const datosConvertidos = response.data.map(cot => ({
      ...cot,
      cotizacion: Number(cot.cotizacion),
    }));

    console.log(`API: Datos convertidos - Cotizaciones para la empresa ${codEmpresa}:`, datosConvertidos);
    return datosConvertidos;
  } catch (error) {
    return manejarError(error, `Error al obtener cotizaciones para la empresa ${codEmpresa}.`);
  }
};

export const traerCodigosDeEmpresas = async (): Promise<string[]> => {
  try {
    const response: AxiosResponse<any, any> = await clienteAxios.get(`empresas`);
    return response.data;
  } catch (error) {
    return manejarError(error, `Error al obtener el arreglo de Empresas`);
  }
}

export const obtenerCotizacionesPorEmpresa = async (codEmpresa: string): Promise<iCotizacion[]> => {
  try {
    const response: AxiosResponse<iCotizacion[]> = await clienteAxios.get(`cotizaciones/filtrarCotdemiDB/${codEmpresa}`);
    const datosConvertidos = response.data.map(cot => ({
      ...cot,
      cotizacion: Number(cot.cotizacion),
    }));
    console.log(`API: Cotizaciones para la empresa ${codEmpresa}:`, datosConvertidos);
    return datosConvertidos;
  } catch (error) {
    return manejarError(error, `Error al obtener cotizaciones para la empresa ${codEmpresa}.`);
  }
};

export const traerCodigosDeIndice = async (): Promise<string[]> => {
  try {
    const response: AxiosResponse<any, any> = await clienteAxios.get(`indices/traerCodigosDeIndices`);
    return response.data;
  } catch (error) {
    return manejarError(error, `Error al obtener el arreglo de Indice`);
  }
}

export const obtenerCotizacionesIndices = async (codIndice: string): Promise<iCotizacionIndice[]> => {
  try {

    const response: AxiosResponse<iCotizacionIndice[]> = await clienteAxios.get(`cotizacionIndice/filtrarCotdemiDB/${codIndice}`);

    const datosConvertidos = response.data.map(cot => ({
      ...cot,
      cotizacion: Number(cot.valorCotizacionIndice),
    }));

    console.log(`API: Datos convertidos - Cotizaciones para el indice ${codIndice}:`, datosConvertidos);
    return datosConvertidos;
  } catch (error) {
    return manejarError(error, `Error al obtener cotizaciones para el indice ${codIndice}.`);
  }
};