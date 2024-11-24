import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empresa } from './empresa.entity';
import { EmpresasService } from './empresas.services';

@Module({
  imports: [TypeOrmModule.forFeature([Empresa])],
  providers: [EmpresasService],
  exports: [EmpresasService],
})
export class EmpresasModule {}
