import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface GraficoCotizacionesProps {
  empresa: string;
  cotizaciones: { fecha: string; cotizacion: number }[];
}

const GraficoCotizaciones: React.FC<GraficoCotizacionesProps> = ({ empresa, cotizaciones }) => {
  // Agrupar cotizaciones por mes
  const agrupadoPorMes: Record<string, number[]> = {};

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

  const datos = {
    labels: promediosMensuales.map(item => item.mes),
    datasets: [
      {
        label: `Cotizaciones de ${empresa} por mes`,
        data: promediosMensuales.map(item => item.promedio),
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
    ],
  };

  return (
    <div>
      <h2>{`Cotizaciones de ${empresa}`}</h2>
      <Line data={datos} />
    </div>
  );
};

export default GraficoCotizaciones;