import { Request, Response } from 'express';
import { AdministracaoController } from '../controllers/AdministracaoController';
import { Disciplina } from '../entity/Disciplina';
import { Professor } from '../entity/Professor';
import { Aluno } from '../entity/Aluno';
import { AlunoDisciplina } from '../entity/Aluno_Disciplina';

describe('AdministracaoController - métodos Disciplina', () => {
  let controller: AdministracaoController;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    controller = new AdministracaoController();

    req = { body: {}, params: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  // criarDisciplina
  it('deve criar disciplina com sucesso', async () => {
    const disciplina = new Disciplina();
    jest.spyOn((controller as any).disciplinaService, 'create').mockResolvedValue(disciplina);

    req.body = { id: 'D1', nome: 'Matemática', carga_horaria: 60 };

    await controller.criarDisciplina(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Disciplina criada com sucesso',
      disciplina
    });
  });

  // lerDisciplina
  it('deve retornar disciplina existente', async () => {
    const disciplina = new Disciplina();
    jest.spyOn((controller as any).disciplinaService, 'findById').mockResolvedValue(disciplina);

    req.params = { id: 'D1' };

    await controller.lerDisciplina(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(disciplina);
  });

  it('deve retornar 404 se disciplina não encontrada', async () => {
    jest.spyOn((controller as any).disciplinaService, 'findById').mockResolvedValue(null);

    req.params = { id: 'D1' };

    await controller.lerDisciplina(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Disciplina não encontrada.' });
  });

  // lerTodasDisciplinas
  it('deve retornar todas disciplinas', async () => {
    const disciplinas = [new Disciplina()];
    jest.spyOn((controller as any).disciplinaService, 'findAll').mockResolvedValue(disciplinas);

    await controller.lerTodasDisciplinas(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(disciplinas);
  });

  it('deve retornar 404 se nenhuma disciplina', async () => {
    jest.spyOn((controller as any).disciplinaService, 'findAll').mockResolvedValue([]);

    await controller.lerTodasDisciplinas(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Nenhuma disciplina cadastrada.' });
  });

  // atualizarDisciplina
  it('deve atualizar disciplina com sucesso', async () => {
    const disciplina = new Disciplina();
    jest.spyOn((controller as any).disciplinaService, 'findById').mockResolvedValue(disciplina);
    jest.spyOn((controller as any).disciplinaService, 'update').mockResolvedValue(disciplina);

    req.params = { id: 'D1' };
    req.body = { nome: 'Nova Disciplina' };

    await controller.atualizarDisciplina(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Disciplina atualizada com sucesso.',
      disciplina
    });
  });

  it('deve retornar 404 ao atualizar disciplina não existente', async () => {
    jest.spyOn((controller as any).disciplinaService, 'findById').mockResolvedValue(null);

    req.params = { id: 'D1' };

    await controller.atualizarDisciplina(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Disciplina não encontrada.' });
  });

  // apagarDisciplina
  it('deve apagar disciplina com sucesso', async () => {
    const disciplina = new Disciplina();
    disciplina.professor = undefined;

    jest.spyOn((controller as any).disciplinaService, 'findById').mockResolvedValue(disciplina);
    jest.spyOn((controller as any).disciplinaService, 'delete').mockResolvedValue(true);

    req.params = { id: 'D1' };

    await controller.apagarDisciplina(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Disciplina apagada com sucesso.' });
  });

  it('deve retornar 400 se disciplina possui professor vinculado', async () => {
    const disciplina = new Disciplina();
    disciplina.professor = new Professor();

    jest.spyOn((controller as any).disciplinaService, 'findById').mockResolvedValue(disciplina);

    req.params = { id: 'D1' };

    await controller.apagarDisciplina(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Não é possível apagar a disciplina. Há um professor vinculado.'
    });
  });

  // vincularProfessor
  it('deve vincular professor à disciplina', async () => {
    const professor = new Professor();
    const disciplina = new Disciplina();

    jest.spyOn((controller as any).professorService, 'findByMatricula').mockResolvedValue(professor);
    jest.spyOn((controller as any).disciplinaService, 'findById').mockResolvedValue(disciplina);
    jest.spyOn((controller as any).disciplinaService, 'update').mockResolvedValue(disciplina);

    req.body = { professorMatricula: 'P1', disciplinaId: 'D1' };

    await controller.vincularProfessor(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Professor vinculado à disciplina com sucesso.',
      disciplina
    });
  });

  // desvincularProfessor
  it('deve desvincular professor da disciplina', async () => {
    const disciplina = new Disciplina();
    disciplina.professor = new Professor();

    jest.spyOn((controller as any).disciplinaService, 'findById').mockResolvedValueOnce(disciplina);
    jest.spyOn((controller as any).disciplinaService, 'removeProfessorFromDisciplina').mockResolvedValue(undefined);
    jest.spyOn((controller as any).disciplinaService, 'findById').mockResolvedValueOnce(disciplina);

    req.params = { disciplinaId: 'D1' };

    await controller.desvincularProfessor(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Professor desvinculado da disciplina com sucesso.',
      disciplina
    });
  });

  // vincularAlunoADisciplina
  it('deve vincular aluno à disciplina', async () => {
    const aluno = new Aluno();
    const disciplina = new Disciplina();
    const alunoDisciplina = new AlunoDisciplina();

    jest.spyOn((controller as any).alunoService, 'findByMatricula').mockResolvedValue(aluno);
    jest.spyOn((controller as any).disciplinaService, 'findById').mockResolvedValue(disciplina);
    jest.spyOn((controller as any).alunoDisciplinaService, 'findByIds').mockResolvedValue(null);
    jest.spyOn((controller as any).alunoDisciplinaService, 'create').mockResolvedValue(alunoDisciplina);

    req.body = {
      alunoMatricula: 'A1',
      disciplinaId: 'D1',
      turno: 'manhã',
      data_inicio_semestre: '2025-01-01',
      data_termino_semestre: '2025-06-30'
    };

    await controller.vincularAlunoADisciplina(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Aluno vinculado à disciplina com sucesso.',
      matricula: alunoDisciplina
    });
  });

  // atualizarNota
  it('deve atualizar nota de aluno', async () => {
    const alunoDisciplina = new AlunoDisciplina();

    jest.spyOn((controller as any).alunoDisciplinaService, 'findByIds').mockResolvedValue(alunoDisciplina);
    jest.spyOn((controller as any).alunoDisciplinaService, 'update').mockResolvedValue(alunoDisciplina);

    req.params = { alunoMatricula: 'A1', disciplinaId: 'D1' };
    req.body = { nota_1: 8, nota_2: 9 };

    await controller.atualizarNota(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Nota(s) atualizada(s) com sucesso.',
      matricula: alunoDisciplina
    });
  });

});
