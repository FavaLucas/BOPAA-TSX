'use client';

import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const GraficoEmpresa = ({ empresa, cotizaciones }) => {
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

  return (
    <div>
      <h2>{empresa.empresaNombre}</h2>
      <Line data={datos} />
    </div>
  );
};

export default GraficoEmpresa;
