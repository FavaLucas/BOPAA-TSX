import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface GraficoProps {
  datos: Array<{
    label: string;
    data: number[];
    labels: string[];
  }>;
  tipoGrafico: 'diario' | 'mensual' | 'anual';
}

const GraficoCotizacionesIndices: React.FC<GraficoProps> = ({ datos, tipoGrafico }) => {
  const data = {
    labels: datos[0]?.labels || [],
    datasets: datos.map(dataset => ({
      label: dataset.label,
      data: dataset.data,
      borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(
        Math.random() * 255
      )}, 1)`,
      backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(
        Math.random() * 255
      )}, 0.2)`,
      fill: true,
    })),
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h2>{tipoGrafico.charAt(0).toUpperCase() + tipoGrafico.slice(1)} Cotizaciones</h2>
      <Line data={data} />
    </div>
  );
};

export default GraficoCotizacionesIndices;
