'use client';

import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const GraficoEmpresa = ({ empresa, cotizaciones }) => {
  const [isClient, setIsClient] = useState(false);
  
  const [empresas, setEmpresas] = useState<Empresa>([]);
  const [cotizaciones, setCotizaciones] = useState<Cotizacion>([]);
  
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
    traerDatos();
    traerDatos2();
  }, []);
  
  // Agrupar cotizaciones por mes
  const agrupadoPorMes = {};
  
  cotizaciones.forEach(cot => {
    const [año, mes] = cot.fecha.split('-');
    const claveMes = `${año}-${mes}`;
    if (!agrupadoPorMes[claveMes]) {
      agrupadoPorMes[claveMes] = [];
    }
    agrupadoPorMes[claveMes].push(cot.cotizacion);
  });
  
  // Calcular el promedio de cotización por mes
  const promediosMensuales = Object.entries(agrupadoPorMes).map(([mes, valores]) => {
    const promedio = valores.reduce((suma, valor) => suma + valor, 0) / valores.length;
    return { mes, promedio };
  });
  
  console.log('GRAFICO EMPRESA: Cotizaciones para la empresa:', cotizaciones);
  console.log('GRAFICO EMPRESA: Agrupado por Mes:', agrupadoPorMes);
  console.log('GRAFICO EMPRESA: Promedios Mensuales:', promediosMensuales);
  
  const datos = {
    labels: promediosMensuales.map(item => item.mes),
    datasets: [
      {
        label: `Cotizaciones de ${empresa.empresaNombre} por mes`,
        data: promediosMensuales.map(item => item.promedio),
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
    ],
  };
  
  if (!isClient) {
    return <p>Cargando gráfico...</p>;
  }
  
  return (
    <div>
      <h2>{empresa.empresaNombre}</h2>
      <Line data={datos} />
    </div>
  );
};



// 'use client';

// import React, { useEffect, useState } from 'react';
// import { Line } from 'react-chartjs-2';
// import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// const GraficoEmpresa = ({ empresa, cotizaciones }) => {
//   const [isClient, setIsClient] = useState(false);

//   const [empresas, setEmpresas] = useState<Empresa>([]);
//   const [cotizaciones, setCotizaciones] = useState<Cotizacion>([]);

//   const traerDatos = async () => {
//     const datos = await axios.get('http://localhost:8080/empresas');
//     const data = datos.data;
//     console.log("Empresas: ", data);
//     return data;
//   }

//   const traerDatos2 = async () => {
//     const datos = await axios.get('http://localhost:8080/cotizaciones');
//     const data = datos.data;
//     console.log("cotizaciones:", data);
//     return data;
//   }


//   useEffect(() => {
//     setIsClient(true);
//     traerDatos();
//     traerDatos2();
//   }, []);

//   // Agrupar cotizaciones por mes
//   const agrupadoPorMes = {};

//   cotizaciones.forEach(cot => {
//     const [año, mes] = cot.fecha.split('-');
//     const claveMes = `${año}-${mes}`;
//     if (!agrupadoPorMes[claveMes]) {
//       agrupadoPorMes[claveMes] = [];
//     }
//     agrupadoPorMes[claveMes].push(cot.cotizacion);
//   });

//   // Calcular el promedio de cotización por mes
//   const promediosMensuales = Object.entries(agrupadoPorMes).map(([mes, valores]) => {
//     const promedio = valores.reduce((suma, valor) => suma + valor, 0) / valores.length;
//     return { mes, promedio };
//   });

//   console.log('GRAFICO EMPRESA: Cotizaciones para la empresa:', cotizaciones);
//   console.log('GRAFICO EMPRESA: Agrupado por Mes:', agrupadoPorMes);
//   console.log('GRAFICO EMPRESA: Promedios Mensuales:', promediosMensuales);

//   const datos = {
//     labels: promediosMensuales.map(item => item.mes),
//     datasets: [
//       {
//         label: `Cotizaciones de ${empresa.empresaNombre} por mes`,
//         data: promediosMensuales.map(item => item.promedio),
//         borderColor: 'rgba(75,192,192,1)',
//         fill: false,
//       },
//     ],
//   };

//   if (!isClient) {
//     return <p>Cargando gráfico...</p>;
//   }

//   return (
//     <div>
//       <h2>{empresa.empresaNombre}</h2>
//       <Line data={datos} />
//     </div>
//   );
// };

// export default GraficoEmpresa;
export default GraficoEmpresa;