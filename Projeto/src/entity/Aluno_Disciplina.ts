import {
    Entity,
    PrimaryColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { Aluno } from "./Aluno";
import { Disciplina } from "./Disciplina";

@Entity()
export class AlunoDisciplina {
    
    @PrimaryColumn()
    alunoMatricula!: string;

    @PrimaryColumn()
    disciplinaId!: string;

    @Column("decimal", { precision: 4, scale: 2, nullable: true })
    nota_1!: number | null;

    @Column("decimal", { precision: 4, scale: 2, nullable: true })
    nota_2!: number | null;

    @Column("decimal", { precision: 4, scale: 2, nullable: true })
    media!: number | null;

    @Column()
    turno!: string;

    @Column({ type: "date" })
    data_inicio_semestre!: Date;

    @Column({ type: "date" })
    data_termino_semestre!: Date;


    @ManyToOne(() => Aluno, aluno => aluno.matriculasDisciplinas, { nullable: false })
    @JoinColumn({ name: "alunoMatricula" })
    aluno!: Aluno;

    @ManyToOne(() => Disciplina, disciplina => disciplina.matriculasAlunos, { nullable: false })
    @JoinColumn({ name: "disciplinaId" })
    disciplina!: Disciplina;
}