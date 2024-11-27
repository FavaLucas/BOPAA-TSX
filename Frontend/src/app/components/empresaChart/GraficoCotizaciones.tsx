import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface GraficoProps {
  datos: {
    labels: string[];
    dataValues: number[];
  };
}

const GraficoCotizaciones: React.FC<GraficoProps> = ({ datos }) => {
  const data = {
    labels: datos.labels,
    datasets: [
      {
        label: 'Cotización',
        data: datos.dataValues,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <Line data={data} />
    </div>
  );
};

export default GraficoCotizaciones;