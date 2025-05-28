import { Router, Request, Response } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { authorizeProfessor } from '../middlewares/authorizeProfessor';
import { ProfessorController } from '../controllers/ProfessorController';

const professorRoutes = Router();
const professorController = new ProfessorController();


professorRoutes.get('/infoprofessor', authenticate, authorizeProfessor, async (req, res) => {
    await professorController.lerProfessor(req, res);
});


professorRoutes.put('/atualizaprofessor', authenticate, authorizeProfessor, async (req, res) => {
    await professorController.atualizarProfessor(req, res);
});


export default professorRoutes;
