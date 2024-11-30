export interface iEmpresa {
  id: number;
  codEmpresa: string;
  empresaNombre: string;
  cotizacionInicial: number;
  cantidadAcciones: number;
}

export interface iCotizacion {
  id: string;
  fecha: string;
  hora: string;
  cotizacion: number;
  codEmpresaFK: {
    codEmpresa: string;
    empresaNombre: string;
    cotizacionInicial: string;
    cantidadAcciones: string;
    id: number;
  };
}

export interface iCotizacionIndice {
  id: number;
  fecha: string;
  hora: string;
  valorCotizacionIndice: string;
  cotizacion: number;
  codigoIndice: {
    codigoIndice: string;
    id: number;
    nombreIndice: string;
    valorFinalIndice: string;
  };
}

export interface iIndice {
  id: number;
  codigoIndice: string;
  nombreIndice: string;
  valorFinalIndice: number; //
  cotizaciones: iCotizacionIndice[];
}