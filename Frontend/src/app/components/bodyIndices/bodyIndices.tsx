import { obtenerCotizacionesIndices, traerCodigosDeIndice } from '@/app/Services/DataService';
import React, { useState, useEffect } from 'react';
import { iCotizacionIndice } from '@/app/models/interfaz';
import './bodyIndices.css';
import GraficoSelector from '../graficoSelector/graficoSelector';
import GraficoCotizaciones from '../graficoCotizaciones/graficoCotizaciones';

const BodyIndices = () => {
  const [indices, setIndices] = useState<string[]>([]);
  const [codIndice, setCodIndice] = useState<string>("TSX");
  const [cotizaciones, setCotizaciones] = useState<iCotizacionIndice[]>([]);
  const [tipoGrafico, setTipoGrafico] = useState<'diario' | 'mensual' | 'anual'>('anual');
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const cargarIndices = async () => {
    try {
      const datos = await traerCodigosDeIndice();
      setIndices(datos);

    } catch (error) {
      console.error('Error al cargar los indices:', error);
      setError('No se pudieron cargar los indices.');
    }
  };

  const cargarDatos = async () => {
    setCargando(true);
    setError(null);
    try {
      const datos = await obtenerCotizacionesIndices(codIndice);
      setCotizaciones(datos);
    } catch (error) {
      console.error('Error al cargar las cotizaciones:', error);
      setError('No se pudieron cargar las cotizaciones.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarIndices();
  }, []);

  useEffect(() => {
    if (codIndice) {
      cargarDatos();
    }
  }, [codIndice]);

  const obtenerDatosGrafico = () => {
    if (tipoGrafico === 'diario') {
      // Agrupar cotizaciones por día
      const agrupadoPorDia: { [key: string]: number[] } = {};
      cotizaciones.forEach(cot => {
        const fecha = cot.fecha.split('T')[0]; 
        if (!agrupadoPorDia[fecha]) {
          agrupadoPorDia[fecha] = [];
        }
        agrupadoPorDia[fecha].push(cot.cotizacion);
      });

      const labels = Object.keys(agrupadoPorDia);
      const dataValues = labels.map(fecha => {
        const sum = agrupadoPorDia[fecha].reduce((acc, val) => acc + val, 0);
        return sum / agrupadoPorDia[fecha].length; 
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
      <h1>Cotizaciones de Indices xxxxxxxxxxxxx</h1>

      {/* Selector de tipo de gráfico */}
      <GraficoSelector tipoGrafico={tipoGrafico} setTipoGrafico={setTipoGrafico} />

      {/* Botones para seleccionar el indice */}

      <div style={{ margin: '10px 0' }}>
        {indices.map(indice => (
          <button
          key={indice}
          onClick={()=> setCodIndice(indice)}
          style={{ margin: '5px', padding: '10px' }}
          >
            {indice}
          </button>
        ))}
      </div>

      {/* Mostrar errores o estado de carga */}
      {cargando && <p>Cargando datos...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Mostrar el gráfico si hay datos */}
      {datosGrafico.dataValues.length > 0 ? (
        <GraficoCotizaciones datos={datosGrafico} tipoGrafico={tipoGrafico} />
      ) : (
        !cargando && <p>No hay datos para mostrar.</p>
      )}
    </div>
  );
};

export default BodyIndices;