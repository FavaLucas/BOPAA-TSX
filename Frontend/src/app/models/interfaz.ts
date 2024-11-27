export interface iEmpresa {
  id: number;
  codEmpresa: string;
  empresaNombre: string;
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
  valorCotizacionIndice: number;
  codigoIndice: iIndice;
}

export interface iIndice {
  id: number;
  codigoIndice: string;
  nombreIndice: string;
  valorFinalIndice: number; //
  cotizaciones: iCotizacionIndice[];
}