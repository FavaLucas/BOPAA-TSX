import { Injectable, OnModuleInit } from '@nestjs/common';
import { Connection } from 'typeorm';
import { InjectConnection } from '@nestjs/typeorm';

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async onModuleInit() {
    await this.createTablesIfNotExists();
  }

  private async createTablesIfNotExists() {
    const queryRunner = this.connection.createQueryRunner();

    const tableExistsCotizaciones = await queryRunner.hasTable('cotizaciones');
    if (!tableExistsCotizaciones) {
      await queryRunner.query(`
        CREATE TABLE cotizaciones (
          id BIGINT AUTO_INCREMENT PRIMARY KEY,
          fecha VARCHAR(10) NOT NULL,
          hora VARCHAR(5) NOT NULL,
          cotizacion DECIMAL(7, 2) NOT NULL,
          codEmpresa BIGINT NOT NULL,
          CONSTRAINT FK_codEmpresa FOREIGN KEY (codEmpresa) REFERENCES empresas(id)
        );
      `);
    }

    const tableExistsCotizacionesIndices = await queryRunner.hasTable('cotizacionesIndices');
    if (!tableExistsCotizacionesIndices) {
      await queryRunner.query(`
        CREATE TABLE cotizacionesIndices (
          id BIGINT AUTO_INCREMENT PRIMARY KEY,
          fecha VARCHAR(10) NOT NULL,
          hora VARCHAR(10) NOT NULL,
          valorCotizacionIndice DECIMAL(20, 4) NOT NULL,
          codigoIndice INT NOT NULL,
          CONSTRAINT FK_codigoIndice FOREIGN KEY (codigoIndice) REFERENCES indices(id)
        );
      `);
    }

    const tableExistsEmpresas = await queryRunner.hasTable('empresas');
    if (!tableExistsEmpresas) {
      await queryRunner.query(`
        CREATE TABLE empresas (
          id INT AUTO_INCREMENT PRIMARY KEY,
          codEmpresa VARCHAR(100) UNIQUE NOT NULL,
          empresaNombre VARCHAR(100) NOT NULL,
          cotizacionInicial DECIMAL(7, 2) NOT NULL,
          cantidadAcciones BIGINT NOT NULL
        );
      `);
    }

    const tableExistsIndices = await queryRunner.hasTable('indices');
    if (!tableExistsIndices) {
      await queryRunner.query(`
        CREATE TABLE indices (
          id INT AUTO_INCREMENT PRIMARY KEY,
          codigoIndice VARCHAR(10) NOT NULL,
          nombreIndice VARCHAR(100) NOT NULL,
          valorFinalIndice BIGINT NOT NULL
        );
      `);
    }
    await queryRunner.release();
  }
}
