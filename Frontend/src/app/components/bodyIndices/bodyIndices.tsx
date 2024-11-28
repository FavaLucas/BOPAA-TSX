import { obtenerCotizacionesIndices, traerCodigosDeIndice } from '@/app/Services/DataService';
import React, { useState, useEffect } from 'react';
import { iCotizacionIndice } from '@/app/models/interfaz';
import './bodyIndices.css';
import GraficoSelector from '../graficoSelector/graficoSelector';
import GraficoCotizacionesIndices from '../graficoCotizaionesIndices/graficoCotizacionesIndices';


const BodyIndices = () => {
  const [indices, setIndices] = useState<string[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<string[]>([]);
  const [cotizaciones, setCotizaciones] = useState<iCotizacionIndice[]>([]);
  const [tipoGrafico, setTipoGrafico] = useState<'diario' | 'mensual' | 'anual'>('anual');
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const cargarIndices = async () => {
    try {
      const datos = await traerCodigosDeIndice();
      setIndices(datos);
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
      const todasCotizaciones = resultados.flat(); // Combina las cotizaciones de todos los índices seleccionados
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
  }, [selectedIndices]);

  const obtenerDatosGrafico = () => {
    const agrupado: { [indice: string]: { [key: string]: number[] } } = {};

    cotizaciones.forEach(cot => {
      const indice = cot.codigoIndice.codigoIndice || 'Desconocido';
      const fechaCompleta = cot.fecha.split('T');
      const [año, mes, dia] = fechaCompleta[0].split('-');
      const hora = fechaCompleta[1]?.split(':')[0] || '00';

      let clave;
      if (tipoGrafico === 'diario') {
        clave = `${dia} ${hora}:00`;
      } else if (tipoGrafico === 'mensual') {
        clave = `${dia}-${mes}`;
      } else {
        clave = `${mes}-${año}`;
      }

      if (!agrupado[indice]) agrupado[indice] = {};
      if (!agrupado[indice][clave]) agrupado[indice][clave] = [];

      agrupado[indice][clave].push(cot.cotizacion);
    });

    const datasets = Object.keys(agrupado).map(indice => {
      const labels = Object.keys(agrupado[indice]);
      const dataValues = labels.map(label => {
        const sum = agrupado[indice][label].reduce((acc, val) => acc + val, 0);
        return sum / agrupado[indice][label].length;
      });

      return {
        label: indice,
        data: dataValues,
        labels,
      };
    });

    return datasets;
  };

  const datosGrafico = obtenerDatosGrafico();

  const toggleIndice = (indice: string) => {
    setSelectedIndices(prev =>
      prev.includes(indice) ? prev.filter(i => i !== indice) : [...prev, indice]
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Cotizaciones de Índices</h1>

      {/* Selector de tipo de gráfico */}
      <GraficoSelector tipoGrafico={tipoGrafico} setTipoGrafico={setTipoGrafico} />

      {/* Botones para seleccionar los índices */}
      <div style={{ margin: '10px 0' }}>
        {indices.map(indice => (
          <button
            key={indice}
            onClick={() => toggleIndice(indice)}
            style={{
              margin: '5px',
              padding: '10px',
              backgroundColor: selectedIndices.includes(indice) ? 'lightgreen' : 'lightgray',
            }}
          >
            {indice}
          </button>
        ))}
      </div>

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






















// import { obtenerCotizacionesIndices, traerCodigosDeIndice } from '@/app/Services/DataService';
// import React, { useState, useEffect } from 'react';
// import { iCotizacionIndice } from '@/app/models/interfaz';
// import './bodyIndices.css';
// import GraficoSelector from '../graficoSelector/graficoSelector';
// import GraficoCotizaciones from '../graficoCotizaciones/graficoCotizaciones';

// const BodyIndices = () => {
//   const [indices, setIndices] = useState<string[]>([]);
//   const [codIndice, setCodIndice] = useState<string>("TSX");
//   const [cotizaciones, setCotizaciones] = useState<iCotizacionIndice[]>([]);
//   const [tipoGrafico, setTipoGrafico] = useState<'diario' | 'mensual' | 'anual'>('anual');
//   const [cargando, setCargando] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const cargarIndices = async () => {
//     try {
//       const datos = await traerCodigosDeIndice();
//       setIndices(datos);

//     } catch (error) {
//       console.error('Error al cargar los indices:', error);
//       setError('No se pudieron cargar los indices.');
//     }
//   };

//   const cargarDatos = async () => {
//     setCargando(true);
//     setError(null);
//     try {
//       const datos = await obtenerCotizacionesIndices(codIndice);
//       setCotizaciones(datos);
//     } catch (error) {
//       console.error('Error al cargar las cotizaciones:', error);
//       setError('No se pudieron cargar las cotizaciones.');
//     } finally {
//       setCargando(false);
//     }
//   };

//   useEffect(() => {
//     cargarIndices();
//   }, []);

//   useEffect(() => {
//     if (codIndice) {
//       cargarDatos();
//     }
//   }, [codIndice]);

//   const obtenerDatosGrafico = () => {
//     if (tipoGrafico === 'diario') {
//       const agrupadoPorDia: { [key: string]: number[] } = {};
//       cotizaciones.forEach(cot => {
//         const fecha = cot.fecha.split('T')[0];
//         if (!agrupadoPorDia[fecha]) {
//           agrupadoPorDia[fecha] = [];
//         }
//         agrupadoPorDia[fecha].push(cot.cotizacion);
//       });

//       const labels = Object.keys(agrupadoPorDia);
//       const dataValues = labels.map(fecha => {
//         const sum = agrupadoPorDia[fecha].reduce((acc, val) => acc + val, 0);
//         return sum / agrupadoPorDia[fecha].length;
//       });

//       return { labels, dataValues };
//     } else if (tipoGrafico === 'mensual') {
//       const agrupadoPorMes: { [key: string]: number[] } = {};
//       cotizaciones.forEach(cot => {
//         const [año, mes] = cot.fecha.split('-');
//         const mesAnio = `${año}-${mes}`;
//         if (!agrupadoPorMes[mesAnio]) {
//           agrupadoPorMes[mesAnio] = [];
//         }
//         agrupadoPorMes[mesAnio].push(cot.cotizacion);
//       });

//       const labels = Object.keys(agrupadoPorMes);
//       const dataValues = labels.map(mes => {
//         const sum = agrupadoPorMes[mes].reduce((acc, val) => acc + val, 0);
//         return sum / agrupadoPorMes[mes].length;
//       });

//       return { labels, dataValues };
//     } else {
//       const agrupadoPorAnio: { [key: string]: number[] } = {};
//       cotizaciones.forEach(cot => {
//         const [año] = cot.fecha.split('-');
//         if (!agrupadoPorAnio[año]) {
//           agrupadoPorAnio[año] = [];
//         }
//         agrupadoPorAnio[año].push(cot.cotizacion);
//       });

//       const labels = Object.keys(agrupadoPorAnio);
//       const dataValues = labels.map(año => {
//         const sum = agrupadoPorAnio[año].reduce((acc, val) => acc + val, 0);
//         return sum / agrupadoPorAnio[año].length;
//       });

//       return { labels, dataValues };
//     }
//   };

//   const datosGrafico = obtenerDatosGrafico();

//   return (
//     <div style={{ padding: '20px' }}>
//       <h1>Cotizaciones de Indices xxxxxxxxxxxxx</h1>

//       {/* Selector de tipo de gráfico */}
//       <GraficoSelector tipoGrafico={tipoGrafico} setTipoGrafico={setTipoGrafico} />

//       {/* Botones para seleccionar el indice */}

//       <div style={{ margin: '10px 0' }}>
//         {indices.map(indice => (
//           <button
//             key={indice}
//             onClick={() => setCodIndice(indice)}
//             style={{ margin: '5px', padding: '10px' }}
//           >
//             {indice}
//           </button>
//         ))}
//       </div>

//       {/* Mostrar errores o estado de carga */}
//       {cargando && <p>Cargando datos...</p>}
//       {error && <p style={{ color: 'red' }}>{error}</p>}

//       {/* Mostrar el gráfico si hay datos */}
//       {datosGrafico.dataValues.length > 0 ? (
//         <GraficoCotizaciones datos={datosGrafico} tipoGrafico={tipoGrafico} />
//       ) : (
//         !cargando && <p>No hay datos para mostrar.</p>
//       )}
//     </div>
//   );
// };

// export default BodyIndices;