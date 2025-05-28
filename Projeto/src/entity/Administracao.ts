import{
    Entity, PrimaryGeneratedColumn, Column, TableInheritance, OneToOne,
    Unique,
    PrimaryColumn, JoinColumn
}from "typeorm";
import { Type, Expose, Exclude, Transform } from 'class-transformer';

import { Pessoa } from "./Pessoa";

@Entity()
export class Administracao{
    @PrimaryColumn()
    pessoaMatricula!: string;

    @OneToOne(() => Pessoa, { nullable: false })
    @JoinColumn({ name: 'pessoaMatricula' })
    @Type(() => Pessoa)
    pessoa!: Pessoa;
}