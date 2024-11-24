import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { EmpresasModule } from './Entities/Empresa/empresas.modules';
import { CotizacionesModule } from './Entities/Cotizacion/cotizaciones.modules';
import { IndicesModule } from './Entities/Indice/indices.modules';
import { CronService } from './Services/cronService';
import { DatabaseService } from './Services/Database.services';
import { CotizacionesService } from './Entities/Cotizacion/cotizaciones.services';
import { CotizacionIndiceService } from './Entities/CotizacionIndice/cotizacionIndice.service';
import { EmpresasService } from './Entities/Empresa/empresas.services';
import { CotizacionIndiceModule } from './Entities/CotizacionIndice/cotizacionIndice.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB,
      synchronize: false,
      entities: ["dist/**/**.entity{.ts,.js}"],
      logging: 'all',
    }),
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    IndicesModule,
    EmpresasModule,
    CotizacionesModule,
    CotizacionIndiceModule,
  ],
  providers: [CronService, CotizacionesService, CotizacionIndiceService, EmpresasService, DatabaseService],
})
export class AppModule {}


