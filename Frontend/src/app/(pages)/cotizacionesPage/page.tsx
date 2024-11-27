import GraficoCotizaciones from '@/app/components/empresaChart/GraficoCotizaciones';
import { obtenerCotizaciones } from '@/app/Services/DataService';
import React, { useState, useEffect } from 'react';
import { iCotizacion } from '@/app/models/interfaz'; // Importar la interfaz si está en otra carpeta

const CotizacionesPage = () => {
  const [codEmpresa, setCodEmpresa] = useState<string>('V'); // Empresa por defecto
  const [cotizaciones, setCotizaciones] = useState<iCotizacion[]>([]); // Lista de cotizaciones tipada
  const [cargando, setCargando] = useState<boolean>(false); // Estado de carga
  const [error, setError] = useState<string | null>(null); // Mensaje de error

  /**
   * Función para cargar los datos de cotizaciones del backend
   */
  const cargarDatos = async () => {
    setCargando(true); // Activar estado de carga
    setError(null); // Limpiar error previo
    try {
      const datos = await obtenerCotizaciones(codEmpresa); // Llamada al servicio
      setCotizaciones(datos); // Guardar los datos en el estado
    } catch (error) {
      console.error('Error al cargar las cotizaciones:', error);
      setError('No se pudieron cargar las cotizaciones.'); // Establecer el error
    } finally {
      setCargando(false); // Desactivar estado de carga
    }
  };

  /**
   * Llama a cargarDatos cada vez que el código de empresa cambia
   */
  useEffect(() => {
    cargarDatos();
  }, [codEmpresa]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Cotizaciones de Empresas</h1>

      {/* Selección de la empresa */}
      <label>
        Selecciona una empresa:
        <select
          value={codEmpresa}
          onChange={(e) => setCodEmpresa(e.target.value)} // Actualizar código de empresa
          style={{ margin: '10px 0', padding: '5px' }}
        >
          <option value="V">Visa Inc.</option>
          <option value="AAPL">Apple Inc.</option>
          <option value="TSLA">Tesla Inc.</option>
          {/* Puedes agregar más empresas aquí */}
        </select>
      </label>

      {/* Mostrar errores o estado de carga */}
      {cargando && <p>Cargando datos...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Mostrar el gráfico si hay datos */}
      {cotizaciones.length > 0 ? (
        <GraficoCotizaciones datos={cotizaciones} />
      ) : (
        !cargando && <p>No hay datos para mostrar.</p>
      )}
    </div>
  );
};

export default CotizacionesPage;
