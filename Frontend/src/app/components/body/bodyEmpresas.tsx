import { obtenerCotizaciones, traerCodigosDeEmpresas } from '@/app/Services/DataService';
import React, { useState, useEffect } from 'react';
import { iCotizacion } from '@/app/models/interfaz';
import '../../../styles/styles.css';
import GraficoSelector from '../graficoSelector/graficoSelector';
import GraficoCotizaciones from '../graficoCotizaciones/graficoCotizaciones';

const BodyEmpresas = () => {
  const [empresas, setEmpresas] = useState<string[]>([]);
  const [selectedEmpresas, setSelectedEmpresas] = useState<string[]>([]);
  const [cotizaciones, setCotizaciones] = useState<iCotizacion[]>([]);
  const [tipoGrafico, setTipoGrafico] = useState<'diario' | 'mensual' | 'anual'>('mensual');
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>(new Date().toISOString().split('T')[0]);
  const [mesSeleccionado, setMesSeleccionado] = useState<string>(new Date().toISOString().split('T')[0].slice(0, 7));
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Paleta de colores asignada a cada empresa
  const colorMap: { [key: string]: string } = {
    'KO': '#FF5733',
    'NVDA': '#33FF57',
    'PEP': '#3357FF',
    'SHEL': '#FF33A1',
    'TM': '#FFA533',
    'V': '#8E44AD',
    'XOM': '#3498DB'
  };

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
      const promises = selectedEmpresas.map(empresa => obtenerCotizaciones(empresa));
      const resultados = await Promise.all(promises);
      const todasCotizaciones = resultados.flat(); // Combina las cotizaciones de todas las empresas seleccionadas
      setCotizaciones(todasCotizaciones);
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
    if (selectedEmpresas.length > 0) {
      cargarDatos();
    }
  }, [selectedEmpresas, fechaSeleccionada]);

  const obtenerDatosGrafico = () => {
    const agrupadoPorEmpresa: { [key: string]: { labels: string[]; dataValues: number[] } } = {};

    // Agrupar cotizaciones por empresa
    cotizaciones.forEach(cot => {
      const empresa = cot.codEmpresaFK.codEmpresa; // Ajusta esto según la estructura de tu modelo
      const fecha = cot.fecha.split('T')[0]; // Obtener solo la fecha

      if (!agrupadoPorEmpresa[empresa]) {
        agrupadoPorEmpresa[empresa] = { labels: [], dataValues: [] };
      }

      if (tipoGrafico === 'diario' && fecha === fechaSeleccionada) {
        const hora = cot.hora.split(':')[0];
        const clave = `${hora}:00`;
        if (!agrupadoPorEmpresa[empresa].labels.includes(clave)) {
          agrupadoPorEmpresa[empresa].labels.push(clave);
          agrupadoPorEmpresa[empresa].dataValues.push(cot.cotizacion);
        } else {
          const index = agrupadoPorEmpresa[empresa].labels.indexOf(clave);
          agrupadoPorEmpresa[empresa].dataValues[index] += cot.cotizacion; // Sumar si ya existe
        }
      } else if (tipoGrafico === 'mensual') {
        if (fecha.startsWith(mesSeleccionado)) {
          if (!agrupadoPorEmpresa[empresa].labels.includes(fecha)) {
            agrupadoPorEmpresa[empresa].labels.push(fecha);
            agrupadoPorEmpresa[empresa].dataValues.push(cot.cotizacion);
          } else {
            const index = agrupadoPorEmpresa[empresa].labels.indexOf(fecha);
            agrupadoPorEmpresa[empresa].dataValues[index] += cot.cotizacion; // Sumar si ya existe
          }
        }
      } else if (tipoGrafico === 'anual') {
        const añoMes = fecha.slice(0, 7); // "YYYY-MM"
        if (!agrupadoPorEmpresa[empresa].labels.includes(añoMes)) {
          agrupadoPorEmpresa[empresa].labels.push(añoMes);
          agrupadoPorEmpresa[empresa].dataValues.push(cot.cotizacion);
        } else {
          const index = agrupadoPorEmpresa[empresa].labels.indexOf(añoMes);
          agrupadoPorEmpresa[empresa].dataValues[index] += cot.cotizacion; // Sumar si ya existe
        }
      }
    });

    // Convertir el objeto agrupado en un formato adecuado para el gráfico
    const datasets = Object.keys(agrupadoPorEmpresa).map(empresa => ({
      label: empresa,
      data: agrupadoPorEmpresa[empresa].dataValues,
      labels: agrupadoPorEmpresa[empresa].labels,
      borderColor: colorMap[empresa], // Asignar color de línea
      backgroundColor: `${colorMap[empresa]}33`, // Color de fondo semi-transparente
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

  const toggleEmpresa = (empresa: string) => {
    setSelectedEmpresas(prev =>
      prev.includes(empresa) ? prev.filter(e => e !== empresa) : [...prev, empresa]
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ padding: '20px', border: '2px solid #ddd', borderRadius: '8px' }}>
        <h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>Cotizaciones de Empresas</h1>
        <h2 style={{ textAlign: 'center' }}>Evolución de Cotizaciones</h2>
      </div>


      {/* Selector de tipo de gráfico */}
      <GraficoSelector tipoGrafico={tipoGrafico} setTipoGrafico={setTipoGrafico} />

      {/* Botones para seleccionar las empresas */}
      <div style={{ margin: '10px 0' }}>
        {empresas.map(empresa => (
          <button
            key={empresa}
            onClick={() => toggleEmpresa(empresa)}
            style={{
              margin: '5px',
              padding: '10px',
              backgroundColor: selectedEmpresas.includes(empresa) ? colorMap[empresa] : 'lightgray',
              color: 'white',
              border: `2px solid ${colorMap[empresa]}`,
            }}
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
      {datosGrafico.length > 0 ? (
        <GraficoCotizaciones datos={datosGrafico} tipoGrafico={tipoGrafico} />
      ) : (
        !cargando && <p>No hay datos para mostrar.</p>
      )}
    </div>
  );
};

export default BodyEmpresas;
