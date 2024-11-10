import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IndiceModule } from './Entities/Indice/indices.modules';
import { EmpresasModule } from './Entities/Empresa/empresas.modules';
import { CotizacionesModule } from './Entities/Cotizacion/cotizaciones.modules';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [ 
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB,
      synchronize: true,
      entities: ["dist/**/**.entity{.ts,.js}"],
      logging: 'all',
    }),
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
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