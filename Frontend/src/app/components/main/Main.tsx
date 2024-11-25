import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Cotizacion, Empresa, Indice } from '@/app/Services/Api';
import GraficoCotizaciones from '../empresaChart/GraficoCotizaciones'; // Asegúrate de que la ruta sea correcta

const Main = () => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [indice, setIndice] = useState<Indice[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empresasData, cotizacionesData, indiceData] = await Promise.all([
          axios.get('http://localhost:8080/empresas'),
          axios.get('http://localhost:8080/cotizaciones'),
          axios.get('http://localhost:8080/indices'),
        ]);

        setEmpresas(empresasData.data);
        setCotizaciones(cotizacionesData.data);
        setIndice(indiceData.data);
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
      <h2>Empresas y Cotizaciones</h2>
      {empresas.map(empresa => {
        // Verifica si las cotizaciones están disponibles antes de filtrar
        const cotizacionesEmpresa = cotizaciones.filter(cot => cot.codEmpresaFK && cot.codEmpresaFK.codEmpresa === empresa.codEmpresa);
        
        // Asegúrate de que haya cotizaciones para la empresa antes de renderizar el gráfico
        if (cotizacionesEmpresa.length === 0) {
          return null; // O podrías mostrar un mensaje indicando que no hay datos
        }

        return (
          <div key={empresa.id}>
            <GraficoCotizaciones empresa={empresa.empresaNombre} cotizaciones={cotizacionesEmpresa} />
          </div>
        );
      })}
    </div>
  );
};

export default Main;