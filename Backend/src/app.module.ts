import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IndiceModule } from './Entities/Indice/indices.modules';
import { EmpresasModule } from './Entities/Empresa/empresas.modules';
import { CotizacionesModule } from './Entities/Cotizacion/cotizaciones.modules';
@Module({
  imports: [ 
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root123',
      database: 'bopaa',
      synchronize: true,
      entities: ["dist/**/**.entity{.ts,.js}"],
      logging: 'all',
    }),
    IndiceModule,
    EmpresasModule,
    CotizacionesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


//modificar clave / valor para que quede con los datos de .env