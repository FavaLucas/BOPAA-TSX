// src/app/components/empresaChart/GraficoSelector.tsx
import React from 'react';

interface GraficoSelectorProps {
  tipoGrafico: 'diario' | 'mensual' | 'anual';
  setTipoGrafico: (tipo: 'diario' | 'mensual' | 'anual') => void;
}

const GraficoSelector: React.FC<GraficoSelectorProps> = ({ tipoGrafico, setTipoGrafico }) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <button onClick={() => setTipoGrafico('diario')} style={{ margin: '5px' }}>
        Gráfico Diario
      </button>
      <button onClick={() => setTipoGrafico('mensual')} style={{ margin: '5px' }}>
        Gráfico Mensual
      </button>
      <button onClick={() => setTipoGrafico('anual')} style={{ margin: '5px' }}>
        Gráfico Anual
      </button>
    </div>
  );
};

export default GraficoSelector;