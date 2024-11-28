// src/app/components/cotizaciones/cotizaciones.tsx

import { obtenerCotizaciones, traerCodigosDeEmpresas } from '@/app/Services/DataService';
import React, { useState, useEffect } from 'react';
import { iCotizacion } from '@/app/models/interfaz';
import './cotizaciones.css';
import GraficoSelector from '../graficoSelector/graficoSelector';
import GraficoCotizacionesNuevo from '../empresaChart/graficoCotizacionesNuevos';

const CotizacionesPage = () => {
  const [empresas, setEmpresas] = useState<string[]>([]);
  const [codEmpresa, setCodEmpresa] = useState<string>('V');
  const [cotizaciones, setCotizaciones] = useState<iCotizacion[]>([]);
  const [tipoGrafico, setTipoGrafico] = useState<'diario' | 'mensual' | 'anual'>('anual');
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const cargarEmpresas = async () => {
    try {
      const datos = await traerCodigosDeEmpresas();
      setEmpresas(datos);
    } catch (error) {
      console.error('Error al cargar las empresas:', error);
      setError('No se pudieron cargar las empresas.');
    }
  };

  const cargarDatos = async () => {
    setCargando(true);
    setError(null);
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

  useEffect(() => {
    cargarEmpresas();
  }, []);

  useEffect(() => {
    if (codEmpresa) {
      cargarDatos();
    }
  }, [codEmpresa]);

  const obtenerDatosGrafico = () => {
    if (tipoGrafico === 'diario') {
      // Agrupar cotizaciones por día
      const agrupadoPorDia: { [key: string]: number[] } = {};
      cotizaciones.forEach(cot => {
        const fecha = cot.fecha.split('T')[0]; // Obtener solo la fecha
        if (!agrupadoPorDia[fecha]) {
          agrupadoPorDia[fecha] = [];
        }
        agrupadoPorDia[fecha].push(cot.cotizacion);
      });

      const labels = Object.keys(agrupadoPorDia);
      const dataValues = labels.map(fecha => {
        const sum = agrupadoPorDia[fecha].reduce((acc, val) => acc + val, 0);
        return sum / agrupadoPorDia[fecha].length; // Promedio diario
      });

      return { labels, dataValues };
    } else if (tipoGrafico === 'mensual') {
      // Agrupar cotizaciones por mes
      const agrupadoPorMes: { [key: string]: number[] } = {};
      cotizaciones.forEach(cot => {
        const [año, mes] = cot.fecha.split('-');
        const mesAnio = `${año}-${mes}`;
        if (!agrupadoPorMes[mesAnio]) {
          agrupadoPorMes[mesAnio] = [];
        }
        agrupadoPorMes[mesAnio].push(cot.cotizacion);
      });

      const labels = Object.keys(agrupadoPorMes);
      const dataValues = labels.map(mes => {
        const sum = agrupadoPorMes[mes].reduce((acc, val) => acc + val, 0);
        return sum / agrupadoPorMes[mes].length; // Promedio mensual
      });

      return { labels, dataValues };
    } else {
      // Anual ```tsx
      const agrupadoPorAnio: { [key: string]: number[] } = {};
      cotizaciones.forEach(cot => {
        const [año] = cot.fecha.split('-');
        if (!agrupadoPorAnio[año]) {
          agrupadoPorAnio[año] = [];
        }
        agrupadoPorAnio[año].push(cot.cotizacion);
      });

      const labels = Object.keys(agrupadoPorAnio);
      const dataValues = labels.map(año => {
        const sum = agrupadoPorAnio[año].reduce((acc, val) => acc + val, 0);
        return sum / agrupadoPorAnio[año].length; // Promedio anual
      });

      return { labels, dataValues };
    }
  };

  const datosGrafico = obtenerDatosGrafico();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Cotizaciones de Empresas</h1>

      {/* Selector de tipo de gráfico */}
      <GraficoSelector tipoGrafico={tipoGrafico} setTipoGrafico={setTipoGrafico} />

      {/* Botones para seleccionar la empresa */}
      <div style={{ margin: '10px 0' }}>
        {empresas.map(empresa => (
          <button
            key={empresa}
            onClick={() => setCodEmpresa(empresa)}
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
      {datosGrafico.dataValues.length > 0 ? (
        <GraficoCotizacionesNuevo datos={datosGrafico} tipoGrafico={tipoGrafico} />
      ) : (
        !cargando && <p>No hay datos para mostrar.</p>
      )}
    </div>
  );
};

export default CotizacionesPage;