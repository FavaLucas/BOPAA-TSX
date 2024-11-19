'use client';

import React, { useState, useEffect } from 'react';
import GraficoEmpresa from '../empresaChart/GraficoEmpresa';
import { obtenerEmpresas, obtenerCotizaciones } from '../../Services/Api';

interface Empresa {
  id: number;
  codEmpresa: string;
  empresaNombre: string;
}

interface Cotizacion {
  id: string;
  fecha: string;
  hora: string;
  cotizacion: number;
  codEmpresa: string;
}

const Main = () => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        console.log('MAIN: Intentando obtener empresas...');
        const datosEmpresas = await obtenerEmpresas();
        console.log('MAIN: Empresas obtenidas:', datosEmpresas);

        // Filtrar empresas con claves únicas y que no sean nulas
        const empresasUnicas = datosEmpresas.reduce((acc: Empresa[], empresa) => {
          const existe = acc.find(e => e.codEmpresa === empresa.codEmpresa);
          if (empresa.codEmpresa && !existe) acc.push(empresa);
          return acc;
        }, [] as Empresa[]);
        setEmpresas(empresasUnicas);

        console.log('MAIN: Empresas únicas:', empresasUnicas);

        console.log('MAIN: Intentando obtener cotizaciones...');
        const datosCotizaciones = await obtenerCotizaciones();
        console.log('MAIN: Cotizaciones obtenidas:', datosCotizaciones);

        const datosConvertidos = datosCotizaciones.map(cot => ({
          ...cot,
          codEmpresa: cot.codEmpresaFK?.codEmpresa || 'unknown',
        }));
        console.log('MAIN: Datos convertidos:', datosConvertidos);

        setCotizaciones(datosConvertidos);
      } catch (error) {
        console.error('MAIN: Error al obtener datos:', error);
      }
    };

    obtenerDatos();
  }, []);

  console.log('MAIN: Empresas:', empresas);
  console.log('MAIN: Cotizaciones:', cotizaciones);

  return (
    <main>
      {empresas.length > 0 && cotizaciones.length > 0 ? (
        empresas.map(empresa => {
          const cotizacionesEmpresa = cotizaciones.filter(cot => cot.codEmpresa === empresa.codEmpresa);
          console.log(`MAIN: Cotizaciones para la empresa ${empresa.empresaNombre}:`, cotizacionesEmpresa);
          return (
            <GraficoEmpresa
              key={`${empresa.id}-${empresa.codEmpresa}`} // Clave única combinando id y codEmpresa
              empresa={empresa} // Pasando la empresa con empresaNombre
              cotizaciones={cotizacionesEmpresa}
            />
          );
        })
      ) : (
        <div>Loading...</div>
      )}
    </main>
  );
};

export default Main;
