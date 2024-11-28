import { obtenerCotizaciones, traerCodigosDeEmpresas } from '@/app/Services/DataService';
import React, { useState, useEffect } from 'react';
import { iCotizacion } from '@/app/models/interfaz';
import './body.css';
import GraficoSelector from '../graficoSelector/graficoSelector';
import GraficoCotizaciones from '../graficoCotizaciones/graficoCotizaciones';

const BodyEmpresas = () => {
  const [empresas, setEmpresas] = useState<string[]>([]);
  const [codEmpresa, setCodEmpresa] = useState<string>('V');
  const [cotizaciones, setCotizaciones] = useState<iCotizacion[]>([]);
  const [tipoGrafico, setTipoGrafico] = useState<'diario' | 'mensual' | 'anual'>('anual');
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>(new Date().toISOString().split('T')[0]);
  const [mesSeleccionado, setMesSeleccionado] = useState<string>(new Date().toISOString().split('T')[0].slice(0, 7));
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
      // Filtrar cotizaciones por fecha seleccionada
      const cotizacionesDelDia = cotizaciones.filter(cot => cot.fecha.split('T')[0] === fechaSeleccionada);
      const agrupadoPorHora: { [key: string]: number[] } = {};
      cotizacionesDelDia.forEach(cot => {
        const hora = cot.hora.split(':')[0]; // Obtener solo la hora
        if (!agrupadoPorHora[hora]) {
          agrupadoPorHora[hora] = [];
        }
        agrupadoPorHora[hora].push(cot.cotizacion);
      });

      const labels = Object.keys(agrupadoPorHora);
      const dataValues = labels.map(hora => {
        const sum = agrupadoPorHora[hora].reduce((acc, val) => acc + val, 0);
        return sum / agrupadoPorHora[hora].length; // Promedio por hora
      });

      return { labels, dataValues };

    } else if (tipoGrafico === 'mensual') {
      // Filtrar cotizaciones por mes seleccionado
      const cotizacionesDelMes = cotizaciones.filter(cot => {
        const [añoMes] = cot.fecha.split('T')[0].split('-').slice(0, 2);
        return `${añoMes}-${cot.fecha.split('T')[0].split('-')[1]}` === mesSeleccionado;
      });

      const agrupadoPorDia: { [key: string]: number[] } = {};
      cotizacionesDelMes.forEach(cot => {
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

    } else {
      // Anual: Agrupar cotizaciones por mes
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
    }
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
      {datosGrafico.dataValues.length > 0 ? (
        <GraficoCotizaciones datos={datosGrafico} tipoGrafico={tipoGrafico} />
      ) : (
        !cargando && <p>No hay datos para mostrar.</p>
      )}
    </div>
  );
};

export default BodyEmpresas;