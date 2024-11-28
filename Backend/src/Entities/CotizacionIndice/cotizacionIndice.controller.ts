import { Controller, Get, HttpException, HttpStatus, Logger, Param } from '@nestjs/common';
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
    async actualizarCotizacionesIndicesDesdeGempresa() {
        /*         this.logger.log("CIC - Actualizando cotizaciones"); */
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
            this.logger.debug("ObetenerCotizaciones", this.cotizacionIndiceService.obtenerTodasLasCotizaciones())
            return await this.cotizacionIndiceService.obtenerTodasLasCotizaciones();
        } catch (error) {
            this.logger.error(`Error al obtener cotizaciones de índices: ${error.message}`);
            throw new HttpException('Error al obtener cotizaciones de índices', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('/test')
    async test() {
        const data = await this.cotizacionIndiceService.calcularIndice();
        return data
    }

    @Get('/traerDatosDB/LocalCotizacionIndice') 
    async traerDatosDBLocalCotizacionIndice(): Promise<CotizacionIndice[]>  {
        return this.cotizacionIndiceService.traerDatosDBLocalCotizacionIndice();   
    }


    @Get('/filtrarCotdemiDB/:codIndice')
    public async GetFiltrarCot(@Param('codIndice') codIndice: string): Promise<CotizacionIndice[]> {
        console.log("Filtrado de cotizaciones de mi DB por codIndice")
        console.log(this.cotizacionIndiceService.getFiltrarCotizaciones(codIndice))
        return await this.cotizacionIndiceService.getFiltrarCotizaciones(codIndice)
    }

}


