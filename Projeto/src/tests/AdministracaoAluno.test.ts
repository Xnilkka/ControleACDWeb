import { Request, Response } from 'express';
import { AdministracaoController } from '../controllers/AdministracaoController';
import { Pessoa } from '../entity/Pessoa';
import { Usuario } from '../entity/Usuario';
import { Aluno } from '../entity/Aluno';

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

describe('AdministracaoController - métodos Aluno', () => {
  let controller: AdministracaoController;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    controller = new AdministracaoController();

    req = {
      body: {
        nome: 'Aluno',
        sobrenome: 'Teste',
        data_nascimento: '2000-01-01',
        email: 'aluno@teste.com',
        telefone: '123456789',
        cpf: '11122233344',
      },
      params: {
        matricula: '20250112345-01',
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Para evitar logs no console durante testes
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  // Testar criarAluno
  it('deve criar aluno com sucesso e retornar 201', async () => {
    const pessoaCriada = new Pessoa();
    const alunoCriado = new Aluno();
    alunoCriado.pessoaMatricula = '20250112345-01';

    jest.spyOn((controller as any).pessoaService, 'create').mockResolvedValue(pessoaCriada);
    jest.spyOn((controller as any).usuarioService, 'create').mockResolvedValue(new Usuario());
    jest.spyOn((controller as any).alunoService, 'create').mockResolvedValue(alunoCriado);

    await controller.criarAluno(req as Request, res as Response);

    expect((controller as any).pessoaService.create).toHaveBeenCalled();
    expect((controller as any).usuarioService.create).toHaveBeenCalled();
    expect((controller as any).alunoService.create).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Aluno criado com sucesso',
      matricula: alunoCriado.pessoaMatricula
    });
  });

  it('deve retornar 500 se erro ao criar aluno', async () => {
    jest.spyOn((controller as any).pessoaService, 'create').mockRejectedValue(new Error('DB Error'));

    await controller.criarAluno(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao criar aluno' });
  });

  // Testar lerAluno
  it('deve retornar aluno pelo matricula com status 200', async () => {
    const aluno = new Aluno();
    aluno.pessoaMatricula = req.params!.matricula!;

    jest.spyOn((controller as any).alunoService, 'findByMatricula').mockResolvedValue(aluno);

    await controller.lerAluno(req as Request, res as Response);

    expect((controller as any).alunoService.findByMatricula).toHaveBeenCalledWith(req.params!.matricula);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(aluno);
  });

  it('deve retornar 404 se aluno não encontrado', async () => {
    jest.spyOn((controller as any).alunoService, 'findByMatricula').mockResolvedValue(null);

    await controller.lerAluno(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Aluno não encontrado.' });
  });

  it('deve retornar 500 se erro ao buscar aluno', async () => {
    jest.spyOn((controller as any).alunoService, 'findByMatricula').mockRejectedValue(new Error('DB Error'));

    await controller.lerAluno(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao buscar aluno.' });
  });

  // Testar lerTodosAlunos
  it('deve retornar todos os alunos com status 200', async () => {
    const alunos = [new Aluno(), new Aluno()];
    jest.spyOn((controller as any).alunoService, 'findAll').mockResolvedValue(alunos);

    await controller.lerTodosAlunos(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(alunos);
  });

  it('deve retornar 404 se nenhum aluno cadastrado', async () => {
    jest.spyOn((controller as any).alunoService, 'findAll').mockResolvedValue([]);

    await controller.lerTodosAlunos(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Nenhum aluno cadastrado.' });
  });

  it('deve retornar 500 se erro ao buscar alunos', async () => {
    jest.spyOn((controller as any).alunoService, 'findAll').mockRejectedValue(new Error('DB Error'));

    await controller.lerTodosAlunos(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao buscar alunos.' });
  });

  // Testar atualizarAluno
  it('deve atualizar aluno com sucesso e retornar 200', async () => {
    const alunoExistente = new Aluno();
    const alunoAtualizado = new Aluno();

    jest.spyOn((controller as any).alunoService, 'findByMatricula').mockResolvedValue(alunoExistente);
    jest.spyOn((controller as any).alunoService, 'update').mockResolvedValue(alunoAtualizado);

    await controller.atualizarAluno(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Aluno atualizado com sucesso.',
      aluno: alunoAtualizado
    });
  });

  it('deve retornar 404 se aluno não encontrado para atualizar', async () => {
    jest.spyOn((controller as any).alunoService, 'findByMatricula').mockResolvedValue(null);

    await controller.atualizarAluno(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Aluno não encontrado.' });
  });

  it('deve retornar 500 se erro ao atualizar aluno', async () => {
    jest.spyOn((controller as any).alunoService, 'findByMatricula').mockResolvedValue(new Aluno());
    jest.spyOn((controller as any).alunoService, 'update').mockRejectedValue(new Error('DB Error'));

    await controller.atualizarAluno(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao atualizar aluno.' });
  });

  // Testar apagarAluno
  it('deve apagar aluno com sucesso e retornar 200', async () => {
    jest.spyOn((controller as any).alunoService, 'findByMatricula').mockResolvedValue(new Aluno());
    jest.spyOn((controller as any).alunoService, 'delete').mockResolvedValue(true);

    await controller.apagarAluno(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Aluno apagado com sucesso.' });
  });

  it('deve retornar 404 se aluno não encontrado para apagar', async () => {
    jest.spyOn((controller as any).alunoService, 'findByMatricula').mockResolvedValue(null);

    await controller.apagarAluno(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Aluno não encontrado.' });
  });

  it('deve retornar 500 se falha ao apagar aluno', async () => {
    jest.spyOn((controller as any).alunoService, 'findByMatricula').mockResolvedValue(new Aluno());
    jest.spyOn((controller as any).alunoService, 'delete').mockResolvedValue(false);

    await controller.apagarAluno(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Falha ao apagar o aluno.' });
  });

  it('deve retornar 500 se erro ao apagar aluno', async () => {
    jest.spyOn((controller as any).alunoService, 'findByMatricula').mockResolvedValue(new Aluno());
    jest.spyOn((controller as any).alunoService, 'delete').mockRejectedValue(new Error('DB Error'));

    await controller.apagarAluno(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao apagar aluno.' });
  });

});
