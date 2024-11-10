import {  Column, PrimaryGeneratedColumn, Entity, OneToMany, JoinColumn, ManyToOne } from "typeorm";
import { Empresa } from "../Empresa/empresa.entity";
@Entity('cotizaciones')
export class Cotizacion {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  public id: number;

  @Column({
    name: 'fecha',
    type: 'varchar',
    precision: 10,
  })
  public fecha: string;

  @Column({
    name: 'hora',
    type: 'varchar',
    precision: 5,
  })
  public hora: string;

  // @Column({
  //   type: 'date',
  // })
  // public dateUTC: Date;

  @Column({
    name: 'cotizacion',
    type: 'decimal',
    precision: 7,
    scale: 2,
  })
  public cotizacion: number;

  // @Column({
  //   name: 'codEmp',
  //   type: 'varchar',
  //   precision: 10,
  // })
  // public codEmp: string;

  @ManyToOne(() => Empresa, (empresa) => empresa.cotizacionesFK)
  @JoinColumn({
    name: 'codEmpresa',
    foreignKeyConstraintName: 'FK_codEmpresa'
  })
  public codEmpresaFK: Empresa;  



  constructor(id: number, fecha: string, hora: string,/* dateUTC: Date,*/ cotizacion: number, codEmpresaFK: Empresa) {
    this.id = id;
    this.fecha = fecha;
    this.hora = hora;
    // this.dateUTC = dateUTC;
    this.cotizacion = cotizacion;
    this.codEmpresaFK = codEmpresaFK;
    

  }

    
}