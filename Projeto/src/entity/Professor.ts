import {
    Entity, PrimaryGeneratedColumn, Column, TableInheritance, OneToOne,
    Unique, PrimaryColumn,
    JoinColumn,
    OneToMany
} from "typeorm";
import { Type, Expose, Exclude, Transform } from 'class-transformer';


import { Pessoa } from "./Pessoa";
import { Disciplina } from "./Disciplina";

@Entity()
export class Professor{
    @PrimaryColumn()
    pessoaMatricula!: string;

    @Column({type: "date"})
    data_contrato!: Date;

    @OneToOne(() => Pessoa, pessoa => pessoa.professor, { nullable: false })
    @JoinColumn({name: 'pessoaMatricula'})
    @Type(() => Pessoa)
    pessoa!: Pessoa;

    @OneToMany(() => Disciplina, disciplina  => disciplina.professor)
    @Type(() => Disciplina)
    disciplinas?: Disciplina[];
}