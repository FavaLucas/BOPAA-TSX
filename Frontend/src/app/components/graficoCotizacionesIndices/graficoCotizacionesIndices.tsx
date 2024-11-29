import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface GraficoProps {
  datos: Array<{
    label: string; // Nombre del índice
    data: number[]; // Valores de cotización
    labels: string[]; // Etiquetas (fechas o horas)
    borderColor: string; // Color de la línea
    backgroundColor: string; // Color del fondo
    fill: boolean; // Rellenar área debajo de la línea
  }>;
  tipoGrafico: 'diario' | 'mensual' | 'anual';
}

const GraficoCotizacionesIndices: React.FC<GraficoProps> = ({ datos, tipoGrafico }) => {
  const data = {
    labels: datos[0]?.labels || [], // Usamos las etiquetas del primer índice
    datasets: datos.map(dataset => ({
      label: dataset.label,
      data: dataset.data,
      borderColor: dataset.borderColor, // Usar el color de línea personalizado
      backgroundColor: dataset.backgroundColor, // Usar el color de fondo personalizado
      fill: dataset.fill,
    })),
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: tipoGrafico === 'diario' ? 'Hora' : 'Fecha'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Cotización'
        }
      }
    },
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const, // Asegurar que sea compatible con los valores esperados
      },
      title: {
        display: true,
        text: 'Evolución de Cotizaciones'
      }
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h2>{tipoGrafico.charAt(0).toUpperCase() + tipoGrafico.slice(1)} Cotizaciones</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default GraficoCotizacionesIndices;
