import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Registra las escalas y componentes que necesitas
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const GraficoCotizaciones = ({ datos }: { datos: any[] }) => {
  // Procesar datos para el gráfico
  const labels = datos.map((dato) => `${dato.fecha} ${dato.hora}`);
  const dataValues = datos.map((dato) => dato.cotizacion);

  const data = {
    labels,
    datasets: [
      {
        label: 'Cotización',
        data: dataValues,
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