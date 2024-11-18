import { PartialType } from '@nestjs/mapped-types';
import { CreateCotizacionIndiceDto } from './create-cotizacion-indice.dto';

export class UpdateCotizacionIndiceDto extends PartialType(CreateCotizacionIndiceDto) {}
