import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Main = () => {
  const [empresas, setEmpresas] = useState([]);
  const [cotizaciones, setCotizaciones] = useState([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const fetchEmpresas = async () => {
      try {
        console.log('MAIN: Intentando obtener empresas...');
        const respuesta = await axios.get('/api/empresas');
        console.log('API: Respuesta completa de la API - Empresas:', respuesta);
        console.log('API: Respuesta de la API - Empresas:', respuesta.data);
        const datosMapeados = respuesta.data.map((empresa: { id: { toString: () => any; }; }) => ({
          ...empresa,
          id: empresa.id.toString(),
        }));
        console.log('API: Datos mapeados - Empresas:', datosMapeados);
        setEmpresas(datosMapeados);
        console.log('MAIN: Empresas obtenidas:', datosMapeados);
      } catch (error) {
        console.error('Error al obtener empresas:', error);
      }
    };

    const fetchCotizaciones = async () => {
      try {
        console.log('MAIN: Intentando obtener cotizaciones...');
        const respuesta = await axios.get('/api/cotizaciones');
        console.log('API: Respuesta completa de la API - Cotizaciones:', respuesta);
        console.log('API: Respuesta de la API - Cotizaciones:', respuesta.data);
        const datosConvertidos = respuesta.data.map((cotizacion: { id: { toString: () => any; }; }) => ({
          ...cotizacion,
          id: cotizacion.id.toString(),
        }));
        console.log('API: Datos convertidos - Cotizaciones:', datosConvertidos);
        setCotizaciones(datosConvertidos);
        console.log('MAIN: Cotizaciones obtenidas:', datosConvertidos);
      } catch (error) {
        console.error('Error al obtener cotizaciones:', error);
      }
    };

    fetchEmpresas();
    fetchCotizaciones();
  }, []);

  if (!isClient) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Empresas y Cotizaciones</h2>
      <p>Empresas: {JSON.stringify(empresas)}</p>
      <p>Cotizaciones: {JSON.stringify(cotizaciones)}</p>
    </div>
  );
};

export default Main;
