// import { IsArray, IsInt, IsNumber, IsString  } from "class-validator"
import { IEmpresa } from "../Empresa/IEmpresa";

// class IndiceDTO {
//     @IsInt()
//     indiceID: number;

//     @IsString()
//     nombreIndice: string;

//     @IsString()
//     paisIndice: string;

//     @IsArray()
//     empresasDelIndice: string[];

//     @IsNumber()
//     valorDelIndice: number;
// }
// export default IndiceDTO


export interface IIndice {
    indiceID?: number;
    nombreIndice: string;
    paisIndice: string;
    empresasDelIndice: IEmpresa[];
    valorDelIndice: number;
}