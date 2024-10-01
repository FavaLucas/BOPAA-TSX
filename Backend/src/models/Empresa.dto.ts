import { IsArray, IsInt, IsNumber, IsString  } from "class-validator"

class Empresa {
    @IsInt()
    id: number;

    @IsString()
    nombre: string;

    @IsString()
    abreviacion: string;

    @IsString()
    pais: string;

    @IsString()
    bolsaDeCotizacion: string;

}

export default Empresa