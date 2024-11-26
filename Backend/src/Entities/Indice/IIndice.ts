export interface iIndiceDB {
    IsNumber()
    id?: number;
    IsString()
    codigoIndice: string;
    IsString()
    nombreIndice: string;
    IsString()
    fecha: string;
    IsNumber()
    hora: string;
    IsNumber()
    valorIndice: number;
}

export interface iIndiceGempresa {
    IsString()
    fecha: string;
    IsString()
    hora: string;
    IsString()
    codigoIndice: string;
    IsNumber()
    valorIndice: number;
}
