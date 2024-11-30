import { Body, Controller, Get, Param, Query, Logger, HttpException, HttpStatus } from "@nestjs/common";
import { CotizacionesService } from "src/Entities/Cotizacion/cotizaciones.services";
import { Cotizacion } from "./cotizacion.entity";
import { EmpresasService } from "../Empresa/empresas.services";

@Controller('/cotizaciones')
export class CotizacionesController {
    constructor(
        private cotizacionesService: CotizacionesService,
        private empresaService: EmpresasService,
    ) { }
    private readonly logger = new Logger(CotizacionesController.name);

    //Trae todas las cotizaciones guardadas en mi DB Local
    //Postman: http://localhost:8080/cotizaciones/
    @Get()
    public async getCotizaciones(): Promise<Cotizacion[]> {
        this.logger.log("CC - Obteniendo todas las cotizaciones");
        try {
            return await this.cotizacionesService.getCotizaciones();
        } catch (error) {
            this.logger.error(`Error al obtener cotizaciones: ${error.message}`);
            throw new HttpException('Error al obtener cotizaciones', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //UTC
    //Ingreso con fechaDesde y hasta de tipo: 2024-11-14T00:00 (YYYY-MM-DDTHH:MM)
    //http://localhost:8080/cotizaciones/entreFechas/V?fechaDesde=2024-01-01T01:00&fechaHasta=2024-01-02T10:00
    @Get('/entreFechas/:codEmpresa')
    public async getCotizacionesEntreFechas(
        @Param('codEmpresa') codEmpresa: string,
        @Query('fechaDesde') fechaDesde: string,
        @Query('fechaHasta') fechaHasta: string
    ): Promise<Cotizacion[]> {
        // this.logger.log(`CC - Obteniendo cotizaciones desde la empresa ${codEmpresa} entre ${fechaDesde} y ${fechaHasta}`);
        try {
            return await this.cotizacionesService.getCotizacionesEntreFechas(codEmpresa, fechaDesde, fechaHasta);
        } catch (error) {
            this.logger.error(`Error al obtener cotizaciones entre fechas: ${error.message}`);
            throw new HttpException('Error al obtener cotizaciones entre fechas', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //UTC
    //Ingreso con codEmpresa + fecha + hora para busacar de Gempresa 1 cotizacion especifica
    //http://localhost:8080/cotizaciones/fechayhora/V?fecha=2024-01-01&hora=08:00
    @Get('fechayhora/:codEmpresa')
    public async getCotizacionesFechaYHora(
        @Param('codEmpresa') codEmpresa: string,
        @Query('fecha') fecha: string,
        @Query('hora') hora: string
    ): Promise<Cotizacion[]> {
        // this.logger.log(`CC - Obteniendo cotización de la empresa ${codEmpresa} el día ${fecha} a la hora ${hora}`);
        try {
            return await this.cotizacionesService.getCotizacionesFechaYHora(codEmpresa, fecha, hora);
        } catch (error) {
            this.logger.error(`Error al obtener cotización por fecha y hora: ${error.message}`);
            throw new HttpException('Error al obtener cotización por fecha y hora', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Postman: http://localhost:8080/cotizaciones/traerCotizacionesMisEmpresas
    //El metodo no me esta trayendo todas las ultimas cotizaciones.
    @Get('/traerCotizacionesMisEmpresas')
    public async actualizarCotizacionesDesdeGempresa(): Promise<void> {
        // this.logger.log("CotizacionesController - Actualizando cotizaciones en DB Local");
        try {
            const arrCodigosEmpresas = await this.empresaService.buscarMisEmpresasDeDB();
            if (arrCodigosEmpresas && arrCodigosEmpresas.length > 0) {
                for (const codEmpresa of arrCodigosEmpresas) {
                    try {
                        await this.cotizacionesService.guardarTodasLasCotizaciones(codEmpresa);
                    } catch (error) {
                        this.logger.error(`Error al actualizar cotizaciones para la empresa ${codEmpresa}: ${error.message}`);
                    }
                }
            } else {
                this.logger.warn("No hay empresas en su DB Local o la búsqueda falló");
            }
        } catch (error) {
            this.logger.error(`Error al actualizar cotizaciones: ${error.message}`);
            throw new HttpException('Error al actualizar cotizaciones', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('/filtrarCotdemiDB/:codEmpresa')
    public async GetFiltrarCot(@Param('codEmpresa') codEmpresa: string): Promise<Cotizacion[]> {
        // console.log("Filtrado de cotizaciones de mi DB por codEmpresa")
        // console.log(this.cotizacionesService.getFiltrarCotizaciones(codEmpresa))
        return await this.cotizacionesService.getFiltrarCotizaciones(codEmpresa)
    }


    @Get('/traerDatos/DBLocalCotizaciones') 
    async traerDatosDBLocalCotizacion(): Promise<Cotizacion[]>  {
        return this.cotizacionesService.traerDatosDBLocalCotizacion();   
    }
}

