"use client"

import { obtenerEmpresasDeDBLocal } from '@/app/Services/DataService';
import React, { useState, useEffect } from 'react';
import { iEmpresa } from '@/app/models/interfaz';
import '../../../styles/styles.css';
import { useTranslation } from 'react-i18next';
import '../../i18n';
import GraficoTortaConTabla from '../graficoTortaEmpresas/graficoTortaEmpresas';

const BodyEmpresasTorta: React.FC = () => {
  const { t } = useTranslation();

  const [empresas, setEmpresas] = useState<iEmpresa[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos de las empresas desde la API
  const cargarDatos = async () => {
    setCargando(true);
    setError(null);
    try {
      const datos = await obtenerEmpresasDeDBLocal();
      console.log("Datos cargados:", datos); // Verificar qué datos se están cargando
      // Convertir cantidadAcciones a número
      const empresasConvertidas = datos.map(emp => ({
        ...emp,
        cantidadAcciones: Number(emp.cantidadAcciones), // Convertir a número
        cotizacionInicial: Number(emp.cotizacionInicial) // Convertir a número si es necesario
      }));
      setEmpresas(empresasConvertidas);
    } catch (err) {
      console.error('Error al cargar las empresas:', err);
      setError(t('error'));
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // Procesar datos para el gráfico de torta
  const procesarDatosParaTorta = () => {
    if (!empresas || empresas.length === 0) return [];
  
    const datosProcesados = empresas.map(emp => ({
      name: emp.empresaNombre, // Nombre de la empresa
      value: emp.cantidadAcciones,
      initValue: emp.cotizacionInicial,
      codEmp: emp.codEmpresa // Participación en acciones
    }));
  
    console.log("Datos procesados para la torta:", datosProcesados); // Verificar los datos procesados
    return datosProcesados;
  };
  const datosGrafico = procesarDatosParaTorta();

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '2.5rem' }}>{t('Participación_de_Empresas')}</h1>
      
      {cargando && <p>{t('loading')}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!cargando && !error && datosGrafico.length > 0 ? (
        <GraficoTortaConTabla datos={datosGrafico} />
      ) : (
        !cargando && <p>{t('no_data')}</p>
      )}
    </div>
  );
};

export default BodyEmpresasTorta;
