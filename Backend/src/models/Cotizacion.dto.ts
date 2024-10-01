import { IsArray, IsInt, IsNumber, IsString  } from "class-validator"

class Cotizacion {
    @IsInt()
    id: number;

    @IsString()
    empresa: string;

    @IsString()
    fecha: string;

    @IsString()
    hora: string;

    @IsNumber()
    precioDolar: number;


}

export default Cotizacion