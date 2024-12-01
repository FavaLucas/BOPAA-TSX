"use client"

import React from 'react';
import { useTranslation } from 'react-i18next';

interface GraficoSelectorProps {
  tipoGrafico: 'diario' | 'mensual' | 'anual';
  setTipoGrafico: (tipo: 'diario' | 'mensual' | 'anual') => void;
}

const GraficoSelector: React.FC<GraficoSelectorProps> = ({ tipoGrafico, setTipoGrafico }) => {
  const { t } = useTranslation(); // Usar useTranslation

  return (
    <div className="flex justify-center mb-4">
      <button
        className={`p-2 border rounded-l-md ${tipoGrafico === 'diario' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
        onClick={() => setTipoGrafico('diario')}
      >
        {t('buttons.daily_chart')}
      </button>
      <button
        className={`p-2 border-t border-b ${tipoGrafico === 'mensual' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
        onClick={() => setTipoGrafico('mensual')}
      >
        {t('buttons.monthly_chart')}
      </button>
      <button
        className={`p-2 border rounded-r-md ${tipoGrafico === 'anual' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
        onClick={() => setTipoGrafico('anual')}
      >
        {t('buttons.annual_chart')}
      </button>
    </div>
  );
};

export default GraficoSelector;
