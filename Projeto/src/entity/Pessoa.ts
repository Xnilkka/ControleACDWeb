import{
    Entity, PrimaryGeneratedColumn, Column, TableInheritance, OneToOne,
    Unique, PrimaryColumn, CreateDateColumn, UpdateDateColumn 
}from "typeorm";
import { Type, Expose, Exclude, Transform } from 'class-transformer';
import {Usuario} from "./Usuario";
import { Aluno } from "./Aluno";
import { Professor } from "./Professor";

@Entity()
export class Pessoa{
    
   // @PrimaryGeneratedColumn()
   // id!: number;

   // @Column({unique: true})
    @PrimaryColumn()
    matricula!: string;

    @Column()
    nome!: string;

    @Column()
    sobrenome!: string;

    @Column({type: "date"})
    data_nascimento!: Date;

    @Column({unique:true})
    email!: string;

    @Column()
    telefone!: string;

    @Column({unique:true})
    cpf!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToOne(() => Usuario, usuario => usuario.pessoa, { nullable: true })
    @Type(() => Usuario)
    usuario?: Usuario;

    
    @OneToOne(() => Aluno, aluno => aluno.pessoa, { nullable: true })
    @Type(() => Aluno)
    aluno?: Aluno;


    @OneToOne(() => Professor, professor => professor.pessoa, { nullable: true })
    @Type(() => Professor)
    professor?: Professor;
}