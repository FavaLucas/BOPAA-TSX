import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Cotizacion } from "../Cotizacion/cotizacion.entity";

@Entity('empresas')
export class Empresa {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  public id: number;

  @Column({
    name: 'codEmpresa',
    length: 100,
    unique: true,
  })
  public codEmpresa: string;

  @Column({
    name: 'empresaNombre',
    length: 100,
  })
  public empresaNombre: string;

  @Column({
    name: 'cotizacionInicial',
    type: 'decimal',
    precision: 7,
    scale: 2,
  })
  public cotizacionInicial: number;

  @Column({
    name: 'cantidadAcciones',
    type: 'bigint',
  })
  public cantidadAcciones: number;

  @OneToMany(() => Cotizacion, (cotizacion) => cotizacion.codEmpresaFK)
  public cotizacionesFK: Cotizacion[];


  constructor(codEmpresa: string, empresaNombre: string, cotizacionInicial: number, cantidadAcciones: number) {
    this.codEmpresa = codEmpresa;
    this.empresaNombre = empresaNombre;
    this.cotizacionInicial = cotizacionInicial;
    this.cantidadAcciones = cantidadAcciones;
  }
}