// src/data-source.ts
import 'dotenv/config';
import { DataSource } from 'typeorm'
import { User } from './entity/User'
import { Administracao } from './entity/Administracao'
import { AlunoDisciplina } from './entity/Aluno_Disciplina'
import { Aluno } from './entity/Aluno'
import { Disciplina } from './entity/Disciplina'
import { Pessoa } from './entity/Pessoa'
import { Professor } from './entity/Professor'
import { Usuario } from './entity/Usuario'

export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true, // me lembrar de tomar cuidado com essa parada aqui pra nao dar B.O
  logging: true,
  entities: [User, Professor, Pessoa, Disciplina, Aluno, AlunoDisciplina, Administracao, Usuario]
})


