// import { IsArray, IsInt, IsNumber, IsString } from "class-validator"

// class CotizacionDTO {
//     @IsInt()
//     id: number;

//     @IsString()
//     empresa: string;

//     @IsString()
//     fecha: string;

//     @IsString()
//     hora: string;

//     @IsNumber()
//     precioDolar: number;
// }
// export default CotizacionDTO

export interface ICotizacion {
    idCotizacion?: number;
    nombreCotizacion: string;
    fechaCotizacion: string;
    horaCotizacion: string;
    precioDolar: number;
}
