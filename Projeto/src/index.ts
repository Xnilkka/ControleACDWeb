import 'reflect-metadata';
import express, { Request, Response } from 'express';
import { AppDataSource } from './data-source';
import administracaoRoutes from './Routes/administracaoRoutes';
import professorRoutes from './Routes/professorRoutes';
import usuarioRoutes from './Routes/usuarioRoutes';
import alunoRoutes from './Routes/alunoRoutes';
import dotenv from 'dotenv';
dotenv.config();

const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/usuario', usuarioRoutes);
app.use('/api/admin', administracaoRoutes);
app.use('/api/professor', professorRoutes);
app.use('/api/aluno', alunoRoutes);




AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
    


    app.listen(3000, () => {
      console.log('Server running on http://localhost:3000');
    });
  })
  .catch((error) => {
    console.error('Error during Data Source initialization:', error);
  });
