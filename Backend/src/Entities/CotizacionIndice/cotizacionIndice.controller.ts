import { Controller, Get, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { CotizacionIndiceService } from './cotizacionIndice.service';
import { IndicesService } from '../Indice/indices.services';
import { CotizacionIndice } from './cotizacionIndice.entity';

@Controller('cotizacionIndice')
export class CotizacionIndiceController {
    constructor(
        private readonly cotizacionIndiceService: CotizacionIndiceService,
        private readonly indiceService: IndicesService,
    ) { }

    private readonly logger = new Logger(CotizacionIndiceController.name);

    @Get('/actualizarDatosIndice')
    async actualizarCotizacionesMisIndices() {
        this.logger.log("CIC - Actualizando cotizaciones");
        try {
            await this.cotizacionIndiceService.actualizarCotizacionesMisIndices();
            return { message: "Cotizaciones Actualizadas" };
        } catch (error) {
            this.logger.error(`Error al actualizar cotizaciones de índices: ${error.message}`);
            throw new HttpException('Error al actualizar cotizaciones de índices', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('/obtenerCotizaciones')
    async obtenerCotizaciones(): Promise<CotizacionIndice[]> {
        try {
            return await this.cotizacionIndiceService.obtenerTodasLasCotizaciones();
        } catch (error) {
            this.logger.error(`Error al obtener cotizaciones de índices: ${error.message}`);
            throw new HttpException('Error al obtener cotizaciones de índices', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}


