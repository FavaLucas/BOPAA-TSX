"use cliente"

import { obtenerCotizaciones, traerCodigosDeEmpresas } from '@/app/Services/DataService';
import React, { useState, useEffect } from 'react';
import { iCotizacion } from '@/app/models/interfaz';
import '../../../styles/styles.css';
import GraficoSelector from '../graficoSelector/graficoSelector';
import GraficoCotizaciones from '../graficoEmpresas/graficoCotizaciones';
import { useTranslation } from 'react-i18next';
import '../../i18n';



const BodyEmpresas = () => {
  const { t, i18n } = useTranslation();

  const [empresas, setEmpresas] = useState<string[]>([]);
  const [cotizaciones, setCotizaciones] = useState<iCotizacion[]>([]);
  const [selectedEmpresas, setSelectedEmpresas] = useState<string[]>(["KO"]);
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
      setError(t('error'));
    }
  };

  const cargarDatos = async () => {
    setCargando(true);
    setError(null);
    try {
      const promises = selectedEmpresas.map(empresa => obtenerCotizaciones(empresa));
      const resultados = await Promise.all(promises);
      const todasCotizaciones = resultados.flat();
      setCotizaciones(todasCotizaciones);
    } catch (error) {
      console.error('Error al cargar las cotizaciones:', error);
      setError(t('error'));
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
  }, [selectedEmpresas, fechaSeleccionada, mesSeleccionado]);

  const obtenerDatosGrafico = () => {
    const agrupadoPorEmpresa: { [key: string]: { labels: string[]; dataValues: number[] } } = {};

    cotizaciones.forEach(cot => {
      const empresa = cot.codEmpresaFK.codEmpresa;
      const fecha = cot.fecha.split('T')[0];

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
          agrupadoPorEmpresa[empresa].dataValues[index] += cot.cotizacion;
        }
      } else if (tipoGrafico === 'mensual') {
        if (fecha.startsWith(mesSeleccionado)) {
          if (!agrupadoPorEmpresa[empresa].labels.includes(fecha)) {
            agrupadoPorEmpresa[empresa].labels.push(fecha);
            agrupadoPorEmpresa[empresa].dataValues.push(cot.cotizacion);
          } else {
            const index = agrupadoPorEmpresa[empresa].labels.indexOf(fecha);
            agrupadoPorEmpresa[empresa].dataValues[index] += cot.cotizacion;
          }
        }
      } else if (tipoGrafico === 'anual') {
        const añoMes = fecha.slice(0, 7);
        if (!agrupadoPorEmpresa[empresa].labels.includes(añoMes)) {
          agrupadoPorEmpresa[empresa].labels.push(añoMes);
          agrupadoPorEmpresa[empresa].dataValues.push(cot.cotizacion);
        } else {
          const index = agrupadoPorEmpresa[empresa].labels.indexOf(añoMes);
          agrupadoPorEmpresa[empresa].dataValues[index] += cot.cotizacion;
        }
      }
    });

    const datasets = Object.keys(agrupadoPorEmpresa).map(empresa => ({
      label: empresa,
      data: agrupadoPorEmpresa[empresa].dataValues,
      labels: agrupadoPorEmpresa[empresa].labels,
      borderColor: colorMap[empresa],
      backgroundColor: `${colorMap[empresa]}33`,
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
    cargarDatos();
  };

  const datosGrafico = obtenerDatosGrafico();

  const toggleEmpresa = (empresa: string) => {
    setSelectedEmpresas(prev =>
      prev.includes(empresa) ? prev.filter(e => e !== empresa) : [...prev, empresa]
    );
  };

  return (
    <div style={{ padding: '14px' }}>
      {/* <LanguageSwitcher />  */}

      <div style={{ padding: '14px', border: '2px solid #ddd', borderRadius: '8px' }}>
      <h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>{t('body_empresas.title')}</h1>

      </div>

      {/* Selector de tipo de gráfico */}
      <GraficoSelector tipoGrafico={tipoGrafico} setTipoGrafico={setTipoGrafico} />

      {/* Botones para seleccionar las empresas */}
      <div style={{ margin: '8px 0' }}>
        {empresas.map(empresa => (
          <button
            key={empresa}
            onClick={() => toggleEmpresa(empresa)}
            style={{
              margin: '4px',
              padding: '6px',
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
        <div className="flex items-center space-x-2">
          <button className="p-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => cambiarDia(-1)}>{t('buttons.previous_day')}</button>
          <button className="p-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => cambiarDia(1)}>{t('buttons.next_day')}</button>
          <p className="text-sm">{t('selected_date')}: {fechaSeleccionada}</p>
        </div>
      )}

      {/* Navegación para el gráfico mensual */}
      {tipoGrafico === 'mensual' && (
        <div className="flex items-center space-x-2">
          <button className="p-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => cambiarMes(-1)}>{t('buttons.previous_month')}</button>
          <button className="p-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => cambiarMes(1)}>{t('buttons.next_month')}</button>
          <p>{t('Mes Seleccionado')}: {mesSeleccionado}</p>
        </div>
      )}

      {/* Mostrar errores o estado de carga */}
      {cargando && <p>{t('loading')}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Mostrar el gráfico si hay datos */}
      {datosGrafico.length > 0 ? (
        <GraficoCotizaciones datos={datosGrafico} tipoGrafico={tipoGrafico} />
      ) : (
        !cargando && <p>{t('no_data')}</p>
      )}
    </div>
  );
};

export default BodyEmpresas;
