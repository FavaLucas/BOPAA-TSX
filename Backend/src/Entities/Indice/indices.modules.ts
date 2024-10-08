import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndicesService } from './indices.services';
import { IndicesController } from './indices.controller';
import { Indice } from './indice.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Indice])],
  controllers: [IndicesController],
  providers: [IndicesService],
})
export class IndiceModule {}