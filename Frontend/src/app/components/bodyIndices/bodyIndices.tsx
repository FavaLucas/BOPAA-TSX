import { obtenerCotizacionesIndices, traerCodigosDeIndice } from '@/app/Services/DataService';
import React, { useState, useEffect } from 'react';
import { iCotizacionIndice } from '@/app/models/interfaz';
import '../../../styles/styles.css';
import GraficoSelector from '../graficoSelector/graficoSelector';
import GraficoCotizacionesIndices from '../graficoCotizacionesIndices/graficoCotizacionesIndices';

const BodyIndices = () => {
  const [indices, setIndices] = useState<string[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<string[]>([]);
  const [cotizaciones, setCotizaciones] = useState<iCotizacionIndice[]>([]);
  const [tipoGrafico, setTipoGrafico] = useState<'diario' | 'mensual' | 'anual'>('mensual');
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>(new Date().toISOString().split('T')[0]);
  const [mesSeleccionado, setMesSeleccionado] = useState<string>(new Date().toISOString().split('T')[0].slice(0, 7));
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const colors = [
    '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFA533',
    '#8E44AD', '#3498DB', '#E74C3C', '#2ECC71', '#F39C12',
    '#9B59B6', '#1ABC9C', '#34495E', '#27AE60', '#E67E22',
    '#2980B9', '#C0392B', '#D35400', '#7D3C98', '#16A085'
  ];

  const [colorMap, setColorMap] = useState<{ [key: string]: string }>({});

  const cargarIndices = async () => {
    try {
      const datos = await traerCodigosDeIndice();
      setIndices(datos);
      const tempColorMap: { [key: string]: string } = {};
      datos.forEach((indice, i) => {
        tempColorMap[indice] = colors[i % colors.length];
      });
      setColorMap(tempColorMap); // Usar setState para actualizar colorMap
    } catch (error) {
      console.error('Error al cargar los índices:', error);
      setError('No se pudieron cargar los índices.');
    }
  };

  const cargarDatos = async () => {
    setCargando(true);
    setError(null);
    try {
      const promises = selectedIndices.map(indice => obtenerCotizacionesIndices(indice));
      const resultados = await Promise.all(promises);
      const todasCotizaciones = resultados.flat();
      setCotizaciones(todasCotizaciones);
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
    if (selectedIndices.length > 0) {
      cargarDatos();
    }
  }, [selectedIndices, fechaSeleccionada]);

  const obtenerDatosGrafico = () => {
    const agrupadoPorIndice: { [key: string]: { labels: string[]; dataValues: number[] } } = {};

    cotizaciones.forEach(cot => {
      const indice = cot.codigoIndice.codigoIndice;
      const fecha = cot.fecha.split('T')[0];

      if (!agrupadoPorIndice[indice]) {
        agrupadoPorIndice[indice] = { labels: [], dataValues: [] };
      }

      if (tipoGrafico === 'diario' && fecha === fechaSeleccionada) {
        const hora = cot.hora.split(':')[0];
        const clave = `${hora}:00`;
        if (!agrupadoPorIndice[indice].labels.includes(clave)) {
          agrupadoPorIndice[indice].labels.push(clave);
          agrupadoPorIndice[indice].dataValues.push(cot.cotizacion);
        } else {
          const index = agrupadoPorIndice[indice].labels.indexOf(clave);
          agrupadoPorIndice[indice].dataValues[index] += cot.cotizacion;
        }
      } else if (tipoGrafico === 'mensual') {
        if (fecha.startsWith(mesSeleccionado)) {
          if (!agrupadoPorIndice[indice].labels.includes(fecha)) {
            agrupadoPorIndice[indice].labels.push(fecha);
            agrupadoPorIndice[indice].dataValues.push(cot.cotizacion);
          } else {
            const index = agrupadoPorIndice[indice].labels.indexOf(fecha);
            agrupadoPorIndice[indice].dataValues[index] += cot.cotizacion;
          }
        }
      } else if (tipoGrafico === 'anual') {
        const añoMes = fecha.slice(0, 7);
        if (!agrupadoPorIndice[indice].labels.includes(añoMes)) {
          agrupadoPorIndice[indice].labels.push(añoMes);
          agrupadoPorIndice[indice].dataValues.push(cot.cotizacion);
        } else {
          const index = agrupadoPorIndice[indice].labels.indexOf(añoMes);
          agrupadoPorIndice[indice].dataValues[index] += cot.cotizacion;
        }
      }
    });

    const datasets = Object.keys(agrupadoPorIndice).map(indice => ({
      label: indice,
      data: agrupadoPorIndice[indice].dataValues,
      labels: agrupadoPorIndice[indice].labels,
      borderColor: colorMap[indice],
      backgroundColor: `${colorMap[indice]}33`,
      fill: true
    }));

    return datasets;
  };

  const cambiarDia = (incremento: number) => {
    const nuevaFecha = new Date(fechaSeleccionada);
    nuevaFecha.setDate(nuevaFecha.getDate() + incremento);
    setFechaSeleccionada(nuevaFecha.toISOString().split('T')[0]);
  };

  const cambiarMes = (incremento: number) => {
    const nuevaFecha = new Date(mesSeleccionado + '-01');
    nuevaFecha.setMonth(nuevaFecha.getMonth() + incremento);
    setMesSeleccionado(nuevaFecha.toISOString().split('T')[0].slice(0, 7));
  };

  const datosGrafico = obtenerDatosGrafico();

  const toggleIndice = (indice: string) => {
    setSelectedIndices(prev =>
      prev.includes(indice) ? prev.filter(i => i !== indice) : [...prev, indice]
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ padding: '20px', border: '2px solid #ddd', borderRadius: '8px' }}>
        <h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>Cotizaciones de Índices</h1>
        <h2 style={{ textAlign: 'center' }}>Evolución de Índices</h2>
      </div>

      {/* Selector de tipo de gráfico */}
      <GraficoSelector tipoGrafico={tipoGrafico} setTipoGrafico={setTipoGrafico} />

      {/* Botones para seleccionar las empresas */}
      <div style={{ margin: '10px 0' }}>
        {indices.map(indice => (
          <button
            key={indice}
            onClick={() => toggleIndice(indice)}
            style={{
              margin: '5px',
              padding: '10px',
              backgroundColor: selectedIndices.includes(indice) ? colorMap[indice] : 'lightgray',
              color: 'white',
              border: `2px solid ${colorMap[indice]}`,
            }}
          >
            {indice}
          </button>
        ))}
      </div>


      {/* Navegación para el gráfico diario */}
      {tipoGrafico === 'diario' && (
        <div>
          <button onClick={() => cambiarDia(-1)}>Día Anterior</button>
          <button onClick={() => cambiarDia(1)}>Día Siguiente</button>
          <p>Fecha Seleccionada: {fechaSeleccionada}</p>
        </div>
      )}

      {/* Navegación para el gráfico mensual */}
      {tipoGrafico === 'mensual' && (
        <div>
          <button onClick={() => cambiarMes(-1)}>Mes Anterior</button>
          <button onClick={() => cambiarMes(1)}>Mes Siguiente</button>
          <p>Mes Seleccionado: {mesSeleccionado}</p>
        </div>
      )}

      {/* Mostrar errores o estado de carga */}
      {cargando && <p>Cargando datos...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Mostrar el gráfico si hay datos */}
      {datosGrafico.length > 0 ? (
        <GraficoCotizacionesIndices datos={datosGrafico} tipoGrafico={tipoGrafico} />
      ) : (
        !cargando && <p>No hay datos para mostrar.</p>
      )}
    </div>
  );
};

export default BodyIndices;
