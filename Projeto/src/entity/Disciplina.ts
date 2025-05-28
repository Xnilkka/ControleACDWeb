import{
    Entity, PrimaryGeneratedColumn, Column, TableInheritance, OneToOne,
    Unique, PrimaryColumn,
    ManyToOne,
    JoinColumn, OneToMany
}from "typeorm";
import { Type, Expose, Exclude, Transform } from 'class-transformer';
import { Professor } from "./Professor";
import { AlunoDisciplina } from "./Aluno_Disciplina";

@Entity()
export class Disciplina {
    @PrimaryColumn()
    id!: string;

    @Column()
    nome!: string;

    @Column("int")
    carga_horaria!: number;

    @ManyToOne(() => Professor, professor => professor.disciplinas, {nullable: true})
    @JoinColumn({name: 'professorMatricula'})
    @Type(() => Professor)
    professor?: Professor;

    @OneToMany(() => AlunoDisciplina, alunoDisciplina => alunoDisciplina.disciplina)
    @Type(() => AlunoDisciplina)
    matriculasAlunos!: AlunoDisciplina[];

}