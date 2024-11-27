'use client';

import { AxiosResponse } from "axios";
import { iCotizacion, iEmpresa, iCotizacionIndice, iIndice } from "../models/interfaz";
import clienteAxios from "./Axios";

/**
 * Procesa las respuestas para cotizaciones.
 */
const procesarRespuestaCotizaciones = (response: AxiosResponse<iCotizacion[]>): iCotizacion[] => {
  console.log('API: Respuesta completa - Cotizaciones:', response);
  console.log('API: Datos devueltos - Cotizaciones:', response.data);
  return Array.isArray(response.data) ? response.data : [];
};

/**
 * Procesa las respuestas para empresas.
 */
const procesarRespuestaEmpresas = (response: AxiosResponse<iEmpresa[]>): iEmpresa[] => {
  console.log('API: Respuesta completa - Empresas:', response);
  console.log('API: Datos devueltos - Empresas:', response.data);
  return Array.isArray(response.data) ? response.data : [];
};

/**
 * Procesa las respuestas para índices.
 */
const procesarRespuestaIndices = (response: AxiosResponse<iIndice[]>): iIndice[] => {
  console.log('API: Respuesta completa - Índices:', response);
  console.log('API: Datos devueltos - Índices:', response.data);
  return Array.isArray(response.data) ? response.data : [];
};

/**
 * Procesa las respuestas para cotizaciones de índices.
 */
const procesarRespuestaCotizacionesIndice = (response: AxiosResponse<iCotizacionIndice[]>): iCotizacionIndice[] => {
  console.log('API: Respuesta completa - Cotizaciones de Índices:', response);
  console.log('API: Datos devueltos - Cotizaciones de Índices:', response.data);
  return Array.isArray(response.data) ? response.data : [];
};


// Función genérica para manejar errores
const manejarError = (error: any, mensaje: string): [] => {
  console.error(`API: ${mensaje}`, error);
  return []; // Retorna un array vacío en caso de error
};

/**
 * Obtiene todas las cotizaciones de la base de datos local.
 */
export const obtenerCotizaciones = async (codEmpresa: string): Promise<iCotizacion[]> => {
  try {
    // Ruta dinámica utilizando el parámetro codEmpresa
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


/**
 * Obtiene todas las empresas de la base de datos local.
 */
// export const obtenerEmpresas = async (): Promise<iEmpresa[]> => {
//   try {
//     const response: AxiosResponse<iEmpresa[]> = await clienteAxios.get('empresas/traerDatos/DBLocalEmpresas');
//     return procesarRespuesta<iEmpresa[]>(response);
//   } catch (error) {
//     return manejarError(error, 'Error al obtener empresas.');
//   }
// };

// /**
//  * Obtiene todos los índices de la base de datos local.
//  */
// export const obtenerIndice = async (): Promise<iIndice[]> => {
//   try {
//     const response: AxiosResponse<iIndice[]> = await clienteAxios.get('indices/traerDatos/DBLocallIndices');
//     return procesarRespuesta<iIndice[]>(response);
//   } catch (error) {
//     return manejarError(error, 'Error al obtener índices.');
//   }
// };

// /**
//  * Obtiene todas las cotizaciones relacionadas con índices de la base de datos local.
//  */
// export const obtenerCotizacionesIndice = async (): Promise<iCotizacionIndice[]> => {
//   try {
//     const response: AxiosResponse<iCotizacionIndice[]> = await clienteAxios.get('cotizacionIndice/traerDatosDB/LocalCotizacionIndices');
//     return procesarRespuesta<iCotizacionIndice[]>(response);
//   } catch (error) {
//     return manejarError(error, 'Error al obtener cotizaciones de índices.');
//   }
// };

/**
 * Obtiene las cotizaciones de una empresa específica por su código.
 * @param codEmpresa - Código de la empresa (por ejemplo, "V" para Visa).
 */
export const obtenerCotizacionesPorEmpresa = async (codEmpresa: string): Promise<iCotizacion[]> => {
  try {
    const response: AxiosResponse<iCotizacion[]> = await clienteAxios.get(`cotizaciones/filtrarCotdemiDB/${codEmpresa}`);
    const datosConvertidos = response.data.map(cot => ({
      ...cot,
      cotizacion: Number(cot.cotizacion), // Convertir la cotización a número
    }));
    console.log(`API: Cotizaciones para la empresa ${codEmpresa}:`, datosConvertidos);
    return datosConvertidos;
  } catch (error) {
    return manejarError(error, `Error al obtener cotizaciones para la empresa ${codEmpresa}.`);
  }
};