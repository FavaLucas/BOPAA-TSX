import { IsArray, IsInt, IsNumber, IsString  } from "class-validator"

// class EmpresaDTO {
//     @IsInt()
//     id: number;

//     @IsString()
//     nombre: string;

//     @IsString()
//     abreviacion: string;

//     @IsString()
//     pais: string;

//     @IsString()
//     bolsaDeCotizacion: string;

// }
// export default EmpresaDTO


export interface IEmpresa {
    id?: number;
    codEmpresa: string;
    empresaNombre: string;
    cotizationInicial: number;
    cantidadAcciones: number;

}