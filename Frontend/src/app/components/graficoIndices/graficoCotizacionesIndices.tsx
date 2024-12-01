import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  
  const data = {
    labels: datos[0]?.labels || [], 
    datasets: datos.map(dataset => ({
      label: dataset.label,
      data: dataset.data,
      borderColor: dataset.borderColor, 
      backgroundColor: dataset.backgroundColor, 
      fill: dataset.fill,
    })),
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: tipoGrafico === 'diario' ? t('buttons.hora') : t('buttons.fecha'),
        }
      },
      y: {
        title: {
          display: true,
          text: t('buttons.cotizacion'),
        }
      }
    },
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const, 
      },
    }
  };

  return (
    <div style={{ marginTop: '10px' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default GraficoCotizacionesIndices;
