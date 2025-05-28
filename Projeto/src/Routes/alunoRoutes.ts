import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { authorizeAluno } from '../middlewares/authorizeAluno';
import { AlunoController } from '../controllers/AlunoController';

const alunoRoutes = Router();
const alunoController = new AlunoController();


alunoRoutes.get('/infoaluno', authenticate, authorizeAluno, async (req, res) => {
    await alunoController.lerAluno(req, res);
});


alunoRoutes.put('/atualizaaluno', authenticate, authorizeAluno, async (req, res) => {
    await alunoController.atualizarAluno(req, res);
});

export default alunoRoutes;
