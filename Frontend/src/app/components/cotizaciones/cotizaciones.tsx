import GraficoCotizaciones from '@/app/components/empresaChart/GraficoCotizaciones';
import { obtenerCotizaciones, traerCodigosDeEmpresas } from '@/app/Services/DataService';
import React, { useState, useEffect } from 'react';
import { iCotizacion, iEmpresa } from '@/app/models/interfaz'; // Importar la interfaz si está en otra carpeta
import './cotizaciones.css';

const CotizacionesPage = () => {
  const [empresas, setEmpresas] = useState<string[]>([]); // Lista de empresas
  const [codEmpresa, setCodEmpresa] = useState<string>('V'); // Empresa por defecto
  const [cotizaciones, setCotizaciones] = useState<iCotizacion[]>([]); // Lista de cotizaciones tipada
  const [cargando, setCargando] = useState<boolean>(false); // Estado de carga
  const [error, setError] = useState<string | null>(null); // Mensaje de error

  /**
   * Función para cargar los datos de empresas del backend
   */

  const codEmpresas = ["V", "KO"]

  const cargarEmpresas = async () => {
    try {
      const datos = await traerCodigosDeEmpresas(); 
      setEmpresas(datos); 
    } catch (error) {
      console.error('Error al cargar las empresas:', error);
      setError('No se pudieron cargar las empresas.'); 
    }
  };

  /**
   * Función para cargar los datos de cotizaciones del backend
   */
  const cargarDatos = async () => {
    setCargando(true); // Activar estado de carga
    setError(null); // Limpiar error previo
    try {
      const datos = await obtenerCotizaciones(codEmpresa); 
      setCotizaciones(datos); 
    } catch (error) {
      console.error('Error al cargar las cotizaciones:', error);
      setError('No se pudieron cargar las cotizaciones.');
    } finally {
      setCargando(false);
    }
  };

  /**
   * Llama a cargarDatos cada vez que el código de empresa cambia
   */
  useEffect(() => {
    cargarEmpresas(); // Cargar empresas al iniciar
  }, []);

  useEffect(() => {
    if (codEmpresa) {
      cargarDatos(); // Cargar datos de cotizaciones al cambiar la empresa
    }
  }, [codEmpresa]);

  // Agrupar cotizaciones por mes
  const cotizacionesPorMes = () => {
    const agrupadoPorMes: { [key: string]: number[] } = {};

    cotizaciones.forEach(cot => {
      const [año, mes] = cot.fecha.split('-');
      const mesAnio = `${año}-${mes}`;
      if (!agrupadoPorMes[mesAnio]) {
        agrupadoPorMes[mesAnio] = [];
      }
      agrupadoPorMes[mesAnio].push(cot.cotizacion);
    });

    // Calcular el promedio de cotizaciones por mes
    const labels = Object.keys(agrupadoPorMes);
    const dataValues = labels.map(mes => {
      const sum = agrupadoPorMes[mes].reduce((acc, val) => acc + val, 0);
      return sum / agrupadoPorMes[mes].length; 
    });

    return { labels, dataValues };
  };

  const { labels, dataValues } = cotizacionesPorMes();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Cotizaciones de Empresas</h1>

      {/* Botones para seleccionar la empresa */}
      <div style={{ margin: '10px 0' }}>
        {empresas.map(empresa => (
          <button
            key={empresa}
            onClick={() => setCodEmpresa(empresa)} // Actualizar código de empresa
            style={{ margin: '5px', padding: '10px' }}
          >
            {empresa}
          </button>
        ))}
      </div>

      {/* Mostrar errores o estado de carga */}
      {cargando && <p>Cargando datos...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Mostrar el gráfico si hay datos */}
      {dataValues.length > 0 ? (
        <GraficoCotizaciones datos={{ labels, dataValues }} />
      ) : (
        !cargando && <p>No hay datos para mostrar.</p>
      )}
    </div>
  );
};

export default CotizacionesPage;