import {
    Entity, PrimaryGeneratedColumn, Column, TableInheritance, OneToOne,
    Unique, PrimaryColumn,
    JoinColumn, OneToMany
} from "typeorm";
import { Type, Expose, Exclude, Transform } from 'class-transformer';
import { Pessoa } from "./Pessoa";
import { AlunoDisciplina } from "./Aluno_Disciplina";

@Entity()
export class Aluno{
    @PrimaryColumn()
    pessoaMatricula!: string;

    @Column()
    periodo!: string;

    @Column({type: "date"})
    data_ingresso!: Date;

    @OneToOne(() => Pessoa, pessoa => pessoa.aluno, { nullable: false})
    @JoinColumn({name: 'pessoaMatricula'})
    @Type(() => Pessoa)
    pessoa!: Pessoa;

    @OneToMany(() => AlunoDisciplina, alunoDisciplina => alunoDisciplina.aluno)
    @Type(() => AlunoDisciplina)
    matriculasDisciplinas!: AlunoDisciplina[];
}