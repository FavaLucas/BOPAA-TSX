import { IsArray, IsInt, IsNumber, IsString  } from "class-validator"

class Indice {
    @IsInt()
    id: number;

    @IsString()
    nombre: string;

    @IsString()
    pais: string;

    @IsArray()
    empresas: string[];

    @IsNumber()
    valorDelIndice: number;
}

export default Indice