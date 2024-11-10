import { Entity, Column, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
// id - codigoIndice(TSX) - nombreIndice - fecha - hora - valorIndice

@Entity('indices')
export class Indice {
  @PrimaryGeneratedColumn({
    type: 'int'
  })
  private id: number;

  @Column({
    name: 'codigoIndice',
    length: 10,
  })
  private codigoIndice: string;

  @Column({
    name: 'nombre',
    length: 100,
  })
  private nombreIndice: string;

  @Column({
    name: 'fecha',
    type: 'varchar',
    precision: 10,
  })
  private fecha: string;

  @Column({
    name: 'hora',
    type: 'varchar',
    precision: 5,
  })
  public hora: string;

  @Column({
    name: 'valorIndice',
    type: 'bigint',
  })
  public valorIndice: number;

  constructor(id: number, codigoIndice: string, nombreIndice: string, fecha: string, hora: string, valorIndice: number) {
    this.id = id;
    this.codigoIndice = codigoIndice;
    this.nombreIndice = nombreIndice;
    this.fecha = fecha;
    this.hora = hora;
    this.valorIndice = valorIndice;
  };
};
