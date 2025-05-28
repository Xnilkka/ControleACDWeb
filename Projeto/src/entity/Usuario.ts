import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,BeforeInsert, BeforeUpdate
  } from "typeorm";
  import { Type, Expose, Exclude, Transform } from 'class-transformer';
  import bcrypt from 'bcrypt';

  import { Pessoa } from "./Pessoa";
  
  @Entity()
  export class Usuario {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column({ unique: true })
    pessoaMatricula!: string;
  
    @Column()
    senha!: string;
  
    @OneToOne(() => Pessoa, pessoa => pessoa.usuario)
    @JoinColumn({ name: 'pessoaMatricula' })
    @Type(() => Pessoa)
    pessoa!: Pessoa;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
      if (!this.senha.startsWith('$2b$')) {
        this.senha = await bcrypt.hash(this.senha, 10);
      }
    }
  }
  