import { Entity, Column, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Empresa } from "../Empresa/empresa.entity";

@Entity('indices')
export class Indice {
  @PrimaryGeneratedColumn()
  private indiceID: number;

  @Column()
  private nombreIndice: string;

  @Column()
  private paisIndice: string;

  @Column("json")
  // private empresasDelIndice: Empresa[];
  private empresasDelIndice: Empresa[];

  @Column()
  private valorDelIndice: number;

  @OneToMany(() => Empresa, (empresa) => empresa.indices)
  @JoinColumn()
  public empresas : Empresa[];

  constructor(indiceID: number, nombreIndice: string, paisIndice: string, empresasDelIndice: Empresa[], valorDelIndice: number) {

    this.indiceID = indiceID;
    this.nombreIndice = nombreIndice;
    this.paisIndice = paisIndice;
    this.empresasDelIndice = empresasDelIndice;
    this.valorDelIndice = valorDelIndice;
  }

  // public getIndiceID(): number { return this.indiceID }
  // public setIndiceID(indiceID: number): void { this.indiceID = indiceID }

  // public getNombreIndice(): string { return this.nombreIndice }
  // public setNombreIndice(nombreIndice: string): void { this.nombreIndice = nombreIndice }

  // public getPaisIndice(): string { return this.paisIndice }
  // public setPaisIndice(paisIndice: string): void { this.paisIndice = paisIndice }

  // public getEmpresasIndice(): IEmpresa[] { return this.empresasDelIndice }
  // public setEmpresasIndice(empresasDelIndice: IEmpresa[]): void { this.empresasDelIndice = empresasDelIndice }

  // public getValorDelIndice(): number { return this.valorDelIndice }
  // public setValorDelIndice(valorDelIndice: number): void { this.valorDelIndice = valorDelIndice }
}