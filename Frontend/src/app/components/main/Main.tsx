

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Cotizacion, Empresa } from '@/app/Services/Api';
import { elements } from 'chart.js';
import GraficoCotizaciones from '../empresaChart/GraficoCotizaciones';

const Main = () => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [isClient, setIsClient] = useState(false);
  
  const traerDatos = async () => {
    const datos = await axios.get('http://localhost:8080/empresas');
    const data = datos.data;
    console.log("Empresas: ", data);
    return data;
  }
  
  const traerDatos2 = async () => {
    const datos = await axios.get('http://localhost:8080/cotizaciones');
    const data = datos.data;
    console.log("cotizaciones:", data);
    return data;
  }
  
  useEffect(() => {
    setIsClient(true);
    
    const fetchEmpresas = async () => {
      try {
        console.log('MAIN: Intentando obtener empresas...');
        const respuesta = await traerDatos();
        console.log('API: Respuesta completa de la API - Empresas:', respuesta);
        // const dataMapeada = (await respuesta).map((empresa: Empresa) => ({
          //   ...empresa, 
          //   id: empresa.id, 
          // }));
          console.log('API: Datos mapeados - Empresas:', respuesta.toString());
          setEmpresas(respuesta.toString());
          console.log('MAIN: Empresas obtenidas:', respuesta);
        } catch (error) {
          console.error('Error al obtener empresas:', error);
        }
      };
      
      const fetchCotizaciones = async () => {
        try {
          console.log('MAIN: Intentando obtener cotizaciones...');
          const respuesta = await traerDatos2();
          console.log('API: Respuesta completa de la API - Cotizaciones:', respuesta);
          const dataMapeada2 = (await respuesta).map((cotizacion: Cotizacion) => ({
            ...cotizacion,
            id: cotizacion.id.toString(),
          }));
          console.log('API: Datos convertidos - Cotizaciones:', dataMapeada2);
          setCotizaciones(dataMapeada2);
          console.log('MAIN: Cotizaciones obtenidas:', dataMapeada2);
        } catch (error) {
          console.error('Error al obtener cotizaciones:', error);
        }
      };
      
      fetchEmpresas();
      fetchCotizaciones();
    }, []);
    
    if (!isClient) {
      return <p>Loading...</p>;
    }
    
    return (
      <div>
      <button onClick={() => traerDatos()}>DATOS EMPRESAS</button>
      <button onClick={() => traerDatos2()}>DATOS COTIZACIONES</button>
      <h2>Empresas y Cotizaciones</h2>
      <p>Empresas: {`${empresas}`}</p>
      <p>Cotizaciones: {JSON.stringify(cotizaciones)}</p>

    </div>
  );
};

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Cotizacion, CotizacionIndice, Empresa, Indice } from '@/app/Services/Api';
// import GraficoCotizaciones from '../empresaChart/GraficoCotizaciones';


// const Main = () => {
//   const [empresas, setEmpresas] = useState<Empresa[]>([]);
//   const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
//   const [indice, setIndice] = useState<Indice[]>([]);
//   const [cotizacionesIndices, setCotizacionesIndice] = useState<CotizacionIndice[]>([]);
//   const [isClient, setIsClient] = useState(false);
//   const [empresaActual, setEmpresaActual] = useState<string>();
//   const [cotizacionEmpresaActual, setCotizacionEmpresaActual] = useState<Cotizacion[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [empresasData, cotizacionesData, indiceData, cotizacionesIndiceData] = await Promise.all([
//           axios.get('http://localhost:8080/traerDatosDBLocalEmpresas'),
//           axios.get('http://localhost:8080/traerDatosDBLocalCotizacion'),
//           axios.get('http://localhost:8080/traerDatosDBLocalIndice'),
//           axios.get('http://localhost:8080/traerDatosDBLocalCotizacionIndice'),
//         ]);

//         setEmpresas(empresasData.data);
//         setCotizaciones(cotizacionesData.data);
//         setIndice(indiceData.data);
//         setCotizacionesIndice(cotizacionesIndiceData.data)
//       } catch (error) {
//         console.error('Error al obtener datos:', error);
//       }
//     };

//     setIsClient(true);
//     fetchData();
//   }, []);

//   if (!isClient) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <div>
//       {
//         empresas.map((emp, index) => (
//           <GraficoCotizaciones empresa={emp.empresaNombre} cotizaciones={cotizaciones} />
//         ))
//       }
//     </div>
//   );
// };

// export default Main;
export default Main;