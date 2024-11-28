// src/app/components/empresaChart/GraficoCotizaciones.tsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface GraficoProps {
  datos: Array<{
    label: string; // Nombre de la empresa
    data: number[]; // Valores de cotización
    labels: string[]; // Etiquetas (fechas o horas)
  }>;
  tipoGrafico: 'diario' | 'mensual' | 'anual';
}

const GraficoCotizaciones: React.FC<GraficoProps> = ({ datos, tipoGrafico }) => {
  const data = {
    labels: datos[0]?.labels || [], // Usamos las etiquetas de la primera empresa
    datasets: datos.map(dataset => ({
      label: dataset.label,
      data: dataset.data,
      borderColor: 'rgba(75,192,192,1)', // Color de línea (puedes personalizarlo)
      backgroundColor: 'rgba(75,192,192,0.2)', // Color de fondo (puedes personalizarlo)
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

export default GraficoCotizaciones;