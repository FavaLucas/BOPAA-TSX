import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Cotizacion, CotizacionIndice, Empresa, Indice } from '@/app/Services/Api';
import GraficoCotizaciones from '../empresaChart/GraficoCotizaciones';


const Main = () => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [indice, setIndice] = useState<Indice[]>([]);
  const [cotizacionesIndices, setCotizacionesIndice] = useState<CotizacionIndice[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [empresaActual, setEmpresaActual] = useState<string>();
  const [cotizacionEmpresaActual, setCotizacionEmpresaActual] = useState<Cotizacion[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empresasData, cotizacionesData, indiceData, cotizacionesIndiceData] = await Promise.all([
          axios.get('http://localhost:8080/traerDatosDBLocalEmpresas'),
          axios.get('http://localhost:8080/traerDatosDBLocalCotizacion'),
          axios.get('http://localhost:8080/traerDatosDBLocalIndice'),
          axios.get('http://localhost:8080/traerDatosDBLocalCotizacionIndice'),
        ]);

        setEmpresas(empresasData.data);
        setCotizaciones(cotizacionesData.data);
        setIndice(indiceData.data);
        setCotizacionesIndice(cotizacionesIndiceData.data)
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };

    setIsClient(true);
    fetchData();
  }, []);

  if (!isClient) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {
        empresas.map((emp, index) => (
          <GraficoCotizaciones empresa={emp.empresaNombre} cotizaciones={cotizaciones} />
        ))
      }
    </div>
  );
};

export default Main;