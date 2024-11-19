import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { EmpresasModule } from './Entities/Empresa/empresas.modules';
import { CotizacionesModule } from './Entities/Cotizacion/cotizaciones.modules';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { ConfigModule } from '@nestjs/config';
import { IndicesModule } from './Entities/Indice/indices.modules';
import { CronService } from './Services/cronService';
import { CotizacionIndiceModule } from './Entities/CotizacionIndice/cotizacionIndice.module';
import { EmpresasController } from './Entities/Empresa/empresas.controller';
import { CotizacionesController } from './Entities/Cotizacion/cotizaciones.controller';
import { EmpresasService } from './Entities/Empresa/empresas.services';
import { CotizacionesService } from './Entities/Cotizacion/cotizaciones.services';


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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


//modificar clave / valor para que quede con los datos de .env