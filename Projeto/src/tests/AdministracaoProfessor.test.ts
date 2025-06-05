import { Request, Response } from 'express';
import { AdministracaoController } from '../controllers/AdministracaoController';
import { Pessoa } from '../entity/Pessoa';
import { Usuario } from '../entity/Usuario';
import { Professor } from '../entity/Professor';
import { Disciplina } from '../entity/Disciplina';

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

describe('AdministracaoController - métodos Professor', () => {
  let controller: AdministracaoController;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    controller = new AdministracaoController();

    req = {
      body: {
        nome: 'Professor',
        sobrenome: 'Teste',
        data_nascimento: '1980-01-01',
        email: 'professor@teste.com',
        telefone: '987654321',
        cpf: '55566677788',
      },
      params: {
        matricula: '20250112345-02',
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  // criarProfessor
  it('deve criar professor com sucesso e retornar 201', async () => {
    const pessoaCriada = new Pessoa();
    const professorCriado = new Professor();
    professorCriado.pessoaMatricula = '20250112345-02';

    jest.spyOn((controller as any).pessoaService, 'create').mockResolvedValue(pessoaCriada);
    jest.spyOn((controller as any).usuarioService, 'create').mockResolvedValue(new Usuario());
    jest.spyOn((controller as any).professorService, 'create').mockResolvedValue(professorCriado);

    await controller.criarProfessor(req as Request, res as Response);

    expect((controller as any).pessoaService.create).toHaveBeenCalled();
    expect((controller as any).usuarioService.create).toHaveBeenCalled();
    expect((controller as any).professorService.create).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Professor criado com sucesso',
      matricula: professorCriado.pessoaMatricula
    });
  });

  it('deve retornar 500 se erro ao criar professor', async () => {
    jest.spyOn((controller as any).pessoaService, 'create').mockRejectedValue(new Error('DB Error'));

    await controller.criarProfessor(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao criar professor' });
  });

  // lerProfessor
  it('deve retornar professor pelo matricula com status 200', async () => {
    const professor = new Professor();
    professor.pessoaMatricula = req.params!.matricula!;

    jest.spyOn((controller as any).professorService, 'findByMatricula').mockResolvedValue(professor);

    await controller.lerProfessor(req as Request, res as Response);

    expect((controller as any).professorService.findByMatricula).toHaveBeenCalledWith(req.params!.matricula);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(professor);
  });

  it('deve retornar 404 se professor não encontrado', async () => {
    jest.spyOn((controller as any).professorService, 'findByMatricula').mockResolvedValue(null);

    await controller.lerProfessor(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Professor não encontrado.' });
  });

  it('deve retornar 500 se erro ao buscar professor', async () => {
    jest.spyOn((controller as any).professorService, 'findByMatricula').mockRejectedValue(new Error('DB Error'));

    await controller.lerProfessor(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao buscar professor.' });
  });

  // lerTodosProfessores
  it('deve retornar todos os professores com status 200', async () => {
    const professores = [new Professor(), new Professor()];
    jest.spyOn((controller as any).professorService, 'findAll').mockResolvedValue(professores);

    await controller.lerTodosProfessores(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(professores);
  });

  it('deve retornar 404 se nenhum professor cadastrado', async () => {
    jest.spyOn((controller as any).professorService, 'findAll').mockResolvedValue([]);

    await controller.lerTodosProfessores(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Nenhum professor cadastrado.' });
  });

  it('deve retornar 500 se erro ao buscar professores', async () => {
    jest.spyOn((controller as any).professorService, 'findAll').mockRejectedValue(new Error('DB Error'));

    await controller.lerTodosProfessores(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao buscar professores.' });
  });

  // atualizarProfessor
  it('deve atualizar professor com sucesso e retornar 200', async () => {
    const professorExistente = new Professor();
    const professorAtualizado = new Professor();

    jest.spyOn((controller as any).professorService, 'findByMatricula').mockResolvedValue(professorExistente);
    jest.spyOn((controller as any).professorService, 'update').mockResolvedValue(professorAtualizado);

    await controller.atualizarProfessor(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Professor atualizado com sucesso.',
      professor: professorAtualizado
    });
  });

  it('deve retornar 404 se professor não encontrado para atualizar', async () => {
    jest.spyOn((controller as any).professorService, 'findByMatricula').mockResolvedValue(null);

    await controller.atualizarProfessor(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Professor não encontrado.' });
  });

  it('deve retornar 500 se erro ao atualizar professor', async () => {
    jest.spyOn((controller as any).professorService, 'findByMatricula').mockResolvedValue(new Professor());
    jest.spyOn((controller as any).professorService, 'update').mockRejectedValue(new Error('DB Error'));

    await controller.atualizarProfessor(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao atualizar professor.' });
  });

  // apagarProfessor
  it('deve apagar professor com sucesso e retornar 200', async () => {
    const professorExistente = new Professor();
    professorExistente.disciplinas = []; // sem disciplinas vinculadas

    jest.spyOn((controller as any).professorService, 'findByMatricula').mockResolvedValue(professorExistente);
    jest.spyOn((controller as any).professorService, 'delete').mockResolvedValue(true);

    await controller.apagarProfessor(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Professor apagado com sucesso.' });
  });

  it('deve retornar 404 se professor não encontrado para apagar', async () => {
    jest.spyOn((controller as any).professorService, 'findByMatricula').mockResolvedValue(null);

    await controller.apagarProfessor(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Professor não encontrado.' });
  });

it('deve retornar 400 se professor vinculado a disciplinas', async () => {
  const professorExistente = new Professor();

  professorExistente.disciplinas = [{
    id: 'disciplina-01',
    nome: 'Matemática',
    carga_horaria: 40,
    matriculasAlunos: []
  } as Disciplina];

  jest.spyOn((controller as any).professorService, 'findByMatricula').mockResolvedValue(professorExistente);

  await controller.apagarProfessor(req as Request, res as Response);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    message: 'Não é possível apagar o professor. Ele está vinculado a uma ou mais disciplinas.'
  });
});

  it('deve retornar 500 se falha ao apagar professor', async () => {
    const professorExistente = new Professor();
    professorExistente.disciplinas = [];

    jest.spyOn((controller as any).professorService, 'findByMatricula').mockResolvedValue(professorExistente);
    jest.spyOn((controller as any).professorService, 'delete').mockResolvedValue(false);

    await controller.apagarProfessor(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Falha ao apagar o professor.' });
  });
}); 
