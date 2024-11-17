import {  Column, PrimaryGeneratedColumn, Entity, OneToMany, JoinColumn, ManyToOne } from "typeorm";
import { Empresa } from "../Empresa/empresa.entity";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
@Entity('cotizaciones')
export class Cotizacion {
  @PrimaryGeneratedColumn({
    type: 'bigint',
})
  public id: number;

  @IsString({ message: 'Fecha debe ser una cadena de texto' }) 
  @IsNotEmpty({ message: 'Fecha es obligatoria' })
  @Column({
    name: 'fecha',
    type: 'varchar',
    precision: 10,
  })
  public fecha: string;

  @IsString({ message: 'Hora debe ser una cadena de texto' }) 
  @IsNotEmpty({ message: 'Hora es obligatoria' })
  @Column({
    name: 'hora',
    type: 'varchar',
    precision: 5,
  })
  public hora: string;

  @IsNumber({}, { message: 'Cotizacion debe ser un número' }) 
  @IsNotEmpty({ message: 'Cotizacion es obligatoria' })
  @Column({
    name: 'cotizacion',
    type: 'decimal',
    precision: 7,
    scale: 2,
  })
  public cotizacion: number;

  @ManyToOne(() => Empresa, (empresa) => empresa.cotizacionesFK)
  @JoinColumn({
    name: 'codEmpresa',
    foreignKeyConstraintName: 'FK_codEmpresa'
  })
  @IsNotEmpty({ message: 'Empresa es obligatoria' })
  public codEmpresaFK: Empresa;  

  constructor(id: number, fecha: string, hora: string, cotizacion: number, codEmpresaFK: Empresa) {
    this.id = id;
    this.fecha = fecha;
    this.hora = hora;
    this.cotizacion = cotizacion;
    this.codEmpresaFK = codEmpresaFK;
  }
}