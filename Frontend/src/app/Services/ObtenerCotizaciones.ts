'use client'
import clienteAxios from "./Axios";
import axios, { AxiosResponse } from 'axios';
// import { iTurno } from "../model/iTurno";



export const obtenerCotizaciones = async () => {
  try {
    // const response: AxiosResponse<any, any> = await clienteAxios.get('/api/cotizaciones',{headers: {Authorization:`Bearer ${sessionStorage.getItem('token')}`}})
    const response: AxiosResponse<any, any> = await clienteAxios.get('/cotizaciones')
    return response.data;
  } catch (error) {
    // alert('No se encontraron cotizaciones');
    throw new Error('No se encontraron Cotizaciones');
  };
};


