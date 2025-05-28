import { Router, Request, Response } from 'express';
import { AdministracaoController } from '../controllers/AdministracaoController';
import { authenticate } from '../middlewares/authenticate';
import { authorizeAdmin } from '../middlewares/authorizeAdmin';


const administracaoRoutes = Router();


const administracaoController = new AdministracaoController();

// Criar admin
administracaoRoutes.post('/admin', async (req: Request, res: Response) => {
    await administracaoController.criarAdmin(req, res);
});

// Criar aluno
administracaoRoutes.post('/alunos', authenticate, authorizeAdmin, async (req: Request, res: Response) => {
    await administracaoController.criarAluno(req, res);
});

// Ler aluno por matrícula
administracaoRoutes.get('/alunos/:matricula', authenticate, authorizeAdmin, async (req: Request, res: Response) => {
    await administracaoController.lerAluno(req, res);
});

// Ler todos os alunos
administracaoRoutes.get('/alunos', authenticate, authorizeAdmin, async (req: Request, res: Response) => {
    await administracaoController.lerTodosAlunos(req, res);
});

// Atualizar aluno por matrícula
administracaoRoutes.put('/alunos/:matricula', authenticate, authorizeAdmin, async (req: Request, res: Response) => {
    await administracaoController.atualizarAluno(req, res);
});

// Apagar aluno por matrícula
administracaoRoutes.delete('/alunos/:matricula', authenticate, authorizeAdmin, async (req: Request, res: Response) => {
    await administracaoController.apagarAluno(req, res);
});

// Criar professor
administracaoRoutes.post('/professores', authenticate, authorizeAdmin, async (req: Request, res: Response) => {
    await administracaoController.criarProfessor(req, res);
});

// Ler professor por matrícula
administracaoRoutes.get('/professores/:matricula', authenticate, authorizeAdmin, async (req: Request, res: Response) => {
    await administracaoController.lerProfessor(req, res);
});

// Ler todos os professores
administracaoRoutes.get('/professores', authenticate, authorizeAdmin, async (req: Request, res: Response) => {
    await administracaoController.lerTodosProfessores(req, res);
});

// Atualizar professor por matrícula
administracaoRoutes.put('/professores/:matricula', authenticate, authorizeAdmin, async (req: Request, res: Response) => {
    await administracaoController.atualizarProfessor(req, res);
});

// Apagar professor por matrícula
administracaoRoutes.delete('/professores/:matricula', authenticate, authorizeAdmin, async (req: Request, res: Response) => {
    await administracaoController.apagarProfessor(req, res);
});

// Criar disciplina
administracaoRoutes.post('/disciplinas', authenticate, authorizeAdmin, async (req: Request, res: Response) => {
    await administracaoController.criarDisciplina(req, res);
});

// Ler disciplina por id
administracaoRoutes.get('/disciplinas/:id', authenticate, authorizeAdmin, async (req: Request, res: Response) => {
    await administracaoController.lerDisciplina(req, res);
});

// Ler todas as disciplinas
administracaoRoutes.get('/disciplinas', authenticate, authorizeAdmin, async (req: Request, res: Response) => {
    await administracaoController.lerTodasDisciplinas(req, res);
});

// Atualizar disciplina por id
administracaoRoutes.put('/disciplinas/:id', authenticate, authorizeAdmin, async (req: Request, res: Response) => {
    await administracaoController.atualizarDisciplina(req, res);
});

// Apagar disciplina por id
administracaoRoutes.delete('/disciplinas/:id', authenticate, authorizeAdmin, async (req: Request, res: Response) => {
    await administracaoController.apagarDisciplina(req, res);
});

// Vincular professor a disciplina
administracaoRoutes.post('/disciplinas/vincular-professor', authenticate, authorizeAdmin, async (req: Request, res: Response) => {
    await administracaoController.vincularProfessor(req, res);
});

// Desvincular professor da disciplina
administracaoRoutes.delete('/disciplinas/:disciplinaId/desvincular-professor', authenticate, authorizeAdmin, async (req: Request, res: Response) => {
    await administracaoController.desvincularProfessor(req, res);
});

// Vincular aluno a disciplina
administracaoRoutes.post('/disciplinas/vincular-aluno', authenticate, authorizeAdmin, async (req: Request, res: Response) => {
    await administracaoController.vincularAlunoADisciplina(req, res);
});

// Atualizar nota do aluno na disciplina
administracaoRoutes.put('/disciplinas/:disciplinaId/atualizar-nota/:alunoMatricula', authenticate, authorizeAdmin, async (req: Request, res: Response) => {
    await administracaoController.atualizarNota(req, res);
});

export default administracaoRoutes;
