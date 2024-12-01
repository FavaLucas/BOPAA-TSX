import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface DatosGrafico {
  name: string;
  value: number;
  codEmp: string;
  initValue: number;
}

interface Props {
  datos: DatosGrafico[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF5733', '#EC4899', '#A855F7'];

const tailwindColors = [
  'text-blue-500', 
  'text-green-500', 
  'text-yellow-500',
  'text-orange-500',
  'text-red-500',   
  'text-pink-500',  
  'text-purple-500',
];

const CustomTooltip = ({ active, payload, totalValue }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    return (
      <div className="bg-white border border-gray-300 p-2">
        <p className="label">{`Código: ${payload[0].payload.codEmp}`}</p>
        <p className="label">{`Valor: ${value}`}</p>
      </div>
    );
  }
  return null;
};

const GraficoTortaConTabla: React.FC<Props> = ({ datos }) => {

  const totalValue = datos.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="flex flex-wrap">
      <div className="w-full md:w-1/2 p-2">

        <PieChart width={600} height={400}>
          <Pie
            data={datos}
            dataKey="value"
            nameKey="codEmp"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label={({ value }) => `${((value / totalValue) * 100).toFixed(2)}%`}
          >
            {datos.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </div>
      <div className="w-full md:w-1/2 p-2">
        <h3 className="text-center text-lg font-semibold">Tabla de Datos</h3>
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Empresa</th>
              <th className="border border-gray-300 p-2">Codigo</th>
              <th className="border border-gray-300 p-2">Val. Inicial</th>
              <th className="border border-gray-300 p-2">Porcentaje (%)</th>
              <th className="border border-gray-300 p-2">Participación</th>
            </tr>
          </thead>
          <tbody>
            {datos.map((dato, index, COLORS) => (
              <tr key={index}>
                <td className={`border font-bold border-gray-300 p-2 ${tailwindColors[index % tailwindColors.length]}`}>{dato.name}</td>
                <td className="border border-gray-300 p-2 text-center">{dato.codEmp}</td>
                <td className="border border-gray-300 p-2 text-center">{dato.initValue}</td>
                <td className="border border-gray-300 p-2 text-center">{((dato.value / totalValue) * 100).toFixed(2)}%</td>
                <td className="border border-gray-300 p-2 text-center">{dato.value.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GraficoTortaConTabla;