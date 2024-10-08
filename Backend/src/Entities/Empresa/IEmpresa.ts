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
    idEmpresa?: number;
    nombreEmpresa: string;
    abreviacion: string;
    paisEmpresa: string;
    bolsaEnQueCotiza: string;
}