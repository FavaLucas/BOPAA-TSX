import { Module } from '@nestjs/common';
import { CotizacionIndiceService } from './cotizacionIndice.service';
import { CotizacionIndiceController } from './cotizacionIndice.controller';

@Module({
  controllers: [CotizacionIndiceController],
  providers: [CotizacionIndiceService],
})
export class CotizacionIndiceModule {}
