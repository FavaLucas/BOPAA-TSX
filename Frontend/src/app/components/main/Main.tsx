import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Cotizacion, CotizacionIndice, Empresa, Indice } from '@/app/Services/Api';
import { elements } from 'chart.js';

const Main = () => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [indice, setIndice] = useState<Indice[]>([]);
  const [cotizacionesIndice, setCotizacionesIndice] = useState<CotizacionIndice[]>([]);
  const [isClient, setIsClient] = useState(false);

  const traerEmpresas = async () => {
    const datos = await axios.get('http://localhost:8080/empresas');
    const data = datos.data;
    console.log("Empresas: ", data);
    return data;
  }

  const traerCotizacionesEmpresas = async () => {
    const datos = await axios.get('http://localhost:8080/cotizaciones');
    const data = datos.data;
    console.log("Cotizaciones:", data);
    return data;
  }

  const traerCotizacionesIndice = async () => {
    const datos = await axios.get('http://localhost:8080/cotizacionIndice/obtenerCotizaciones');
    const data = datos.data;
    console.log("CotizacionesIndice:", data);
    return data;
  }

  const traerIndice = async () => {
    const datos = await axios.get('http://localhost:8080/indices');
    const data = datos.data;
    console.log("Indice:", data);
    return data;
  }



  useEffect(() => {
    setIsClient(true);

    const fetchEmpresas = async () => {
      try {
        console.log('MAIN: Intentando obtener empresas...');
        const respuesta = await traerEmpresas();
        console.log('API: Respuesta completa de la API - Empresas:', respuesta);
        // const dataMapeada = (await respuesta).map((empresa: Empresa) => ({
        //   ...empresa, 
        //   id: empresa.id, 
        // }));
        console.log('API: Datos mapeados - Empresas:', respuesta.toString());
        setEmpresas(respuesta.toString());
        console.log('MAIN: Empresas obtenidas:', respuesta);
      } catch (error) {
        console.error('Error al obtener empresas:', error);
      }
    };

    const fetchIndice = async () => {
      try {
        console.log('MAIN: Intentando obtener indice...');
        const respuesta = await traerIndice();
        console.log('API: Respuesta completa de la API - Indice:', respuesta);
        // const dataMapeada = (await respuesta).map((empresa: Empresa) => ({
        //   ...empresa, 
        //   id: empresa.id, 
        // }));
        console.log('API: Datos mapeados - Indice:', respuesta.toString());
        setIndice(respuesta.toString());
        console.log('MAIN: Indice obtenidas:', respuesta);
      } catch (error) {
        console.error('Error al obtener Indice:', error);
      }
    };

    const fetchCotizaciones = async () => {
      try {
        console.log('MAIN: Intentando obtener cotizaciones...');
        const respuesta = await traerCotizacionesEmpresas();
        console.log('API: Respuesta completa de la API - Cotizaciones:', respuesta);
        const dataMapeada2 = (await respuesta).map((cotizacion: Cotizacion) => ({
          ...cotizacion,
          id: cotizacion.id.toString(),
        }));
        console.log('API: Datos convertidos - Cotizaciones:', dataMapeada2);
        setCotizaciones(dataMapeada2);
        console.log('MAIN: Cotizaciones obtenidas:', dataMapeada2);
      } catch (error) {
        console.error('Error al obtener cotizaciones:', error);
      }
    };

    const fetchCotizacionesIndice = async () => {
      try {
        console.log('MAIN: Intentando obtener cotizaciones indice...');
        const respuesta = await traerCotizacionesIndice();
        console.log('API: Respuesta completa de la API - CotizacionesIndice:', respuesta);
        const dataMapeada2 = (await respuesta).map((cotizacionIndice: CotizacionIndice) => ({
          ...cotizacionIndice,
          id: cotizacionIndice.id.toString(),
        }));
        console.log('API: Datos convertidos - CotizacionesIndice:', dataMapeada2);
        setCotizacionesIndice(dataMapeada2);
        console.log('MAIN: Cotizaciones Indices obtenidas:', dataMapeada2);
      } catch (error) {
        console.error('Error al obtener cotizaciones indice:', error);
      }
    };

    fetchEmpresas();
    fetchCotizaciones();
    fetchCotizacionesIndice()
    fetchIndice();
  }, []);

  if (!isClient) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <button onClick={() => traerEmpresas()}>DATOS EMPRESAS</button>
      <button onClick={() => traerCotizacionesEmpresas()}>DATOS COTIZACIONES</button>
      <button onClick={() => traerIndice()}>DATOS INDICE</button>
      <button onClick={() => traerCotizacionesIndice()}>DATOS COTIZACIONES INDICES</button>
      <h2>Empresas y Cotizaciones</h2>
      <p>Empresas: {`${empresas}`}</p>
      <p>Cotizaciones: {JSON.stringify(cotizaciones)}</p>
      <p>Indice: {JSON.stringify(indice)}</p>
      <p>Cotizaciones Indice: {JSON.stringify(cotizacionesIndice)}</p>
    </div>
  );
};

export default Main;
