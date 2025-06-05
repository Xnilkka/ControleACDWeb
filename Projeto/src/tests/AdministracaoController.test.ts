import { Request, Response } from 'express';
import { AdministracaoController } from '../controllers/AdministracaoController';
import { Pessoa } from '../entity/Pessoa';
import { Usuario } from '../entity/Usuario';
import { Administracao } from '../entity/Administracao';

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

describe('AdministracaoController', () => {
  let controller: AdministracaoController;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    controller = new AdministracaoController();

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('criarAdmin', () => {
    beforeEach(() => {
      req = {
        body: {
          nome: 'Test',
          sobrenome: 'User',
          data_nascimento: '2000-01-01',
          email: 'test@qualquercoisa.com',
          telefone: '12345678',
          cpf: '00000000000'
        }
      };
    });

    it('deve criar admin com sucesso e retornar 201', async () => {
      const pessoaCriada = new Pessoa();
      const adminCriado = new Administracao();
      adminCriado.pessoaMatricula = '20250112345-03';

      jest.spyOn((controller as any).pessoaService, 'create').mockResolvedValue(pessoaCriada);
      jest.spyOn((controller as any).usuarioService, 'create').mockResolvedValue(new Usuario());
      jest.spyOn((controller as any).administracaoService, 'create').mockResolvedValue(adminCriado);

      await controller.criarAdmin(req as Request, res as Response);

      expect((controller as any).pessoaService.create).toHaveBeenCalled();
      expect((controller as any).usuarioService.create).toHaveBeenCalled();
      expect((controller as any).administracaoService.create).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Admin criado com sucesso',
        matricula: adminCriado.pessoaMatricula
      });
    });

    it('deve retornar 500 se ocorrer um erro', async () => {
      jest.spyOn((controller as any).pessoaService, 'create').mockRejectedValue(new Error('DB Error'));

      await controller.criarAdmin(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Erro ao criar Admin'
      });
    });
  });

  describe('lerAdmin', () => {
    beforeEach(() => {
      req = {
        params: { matricula: '123' }
      };
    });

    it('deve retornar 404 se admin não for encontrado', async () => {
      jest.spyOn((controller as any).administracaoService, 'findByMatricula').mockResolvedValue(null);

      await controller.lerAdmin(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Admin não encontrado.' });
    });

    it('deve retornar 200 com o admin encontrado', async () => {
      const adminMock = new Administracao();
      jest.spyOn((controller as any).administracaoService, 'findByMatricula').mockResolvedValue(adminMock);

      await controller.lerAdmin(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(adminMock);
    });

    it('deve retornar 500 em caso de erro', async () => {
      jest.spyOn((controller as any).administracaoService, 'findByMatricula').mockRejectedValue(new Error('DB Error'));

      await controller.lerAdmin(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao buscar admin.' });
    });
  });

  describe('lerTodosAdmin', () => {
    beforeEach(() => {
      req = {};
    });

    it('deve retornar 404 se não houver admins cadastrados', async () => {
      jest.spyOn((controller as any).administracaoService, 'findAll').mockResolvedValue([]);

      await controller.lerTodosAdmin(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Nenhum admin cadastrado.' });
    });

    it('deve retornar 200 com lista de admins', async () => {
      const adminsMock = [new Administracao(), new Administracao()];
      jest.spyOn((controller as any).administracaoService, 'findAll').mockResolvedValue(adminsMock);

      await controller.lerTodosAdmin(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(adminsMock);
    });

    it('deve retornar 500 em caso de erro', async () => {
      jest.spyOn((controller as any).administracaoService, 'findAll').mockRejectedValue(new Error('DB Error'));

      await controller.lerTodosAdmin(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao buscar admins.' });
    });
  });

  describe('atualizarAdmin', () => {
    beforeEach(() => {
      req = {
        params: { matricula: '123' },
        body: { nome: 'Novo Nome' }
      };
    });

    it('deve retornar 404 se admin não existir', async () => {
      jest.spyOn((controller as any).administracaoService, 'findByMatricula').mockResolvedValue(null);

      await controller.atualizarAdmin(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Admin não encontrado.' });
    });

    it('deve atualizar admin e retornar 200 com dados atualizados', async () => {
      const adminAtualizadoMock = new Administracao();
      jest.spyOn((controller as any).administracaoService, 'findByMatricula').mockResolvedValue(new Administracao());
      jest.spyOn((controller as any).administracaoService, 'update').mockResolvedValue(adminAtualizadoMock);

      await controller.atualizarAdmin(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Admin atualizado com sucesso.',
        admin: adminAtualizadoMock
      });
    });

    it('deve retornar 500 em caso de erro', async () => {
      jest.spyOn((controller as any).administracaoService, 'findByMatricula').mockRejectedValue(new Error('DB Error'));

      await controller.atualizarAdmin(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao atualizar admin.' });
    });
  });

  describe('apagarAdmin', () => {
    beforeEach(() => {
      req = {
        params: { matricula: '123' }
      };
    });

    it('deve retornar 404 se admin não existir', async () => {
      jest.spyOn((controller as any).administracaoService, 'findByMatricula').mockResolvedValue(null);

      await controller.apagarAdmin(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Admin não encontrado.' });
    });

    it('deve retornar 200 se admin for apagado com sucesso', async () => {
      jest.spyOn((controller as any).administracaoService, 'findByMatricula').mockResolvedValue(new Administracao());
      jest.spyOn((controller as any).administracaoService, 'delete').mockResolvedValue(true);

      await controller.apagarAdmin(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Admin apagado com sucesso.' });
    });

    it('deve retornar 500 se apagar falhar', async () => {
      jest.spyOn((controller as any).administracaoService, 'findByMatricula').mockResolvedValue(new Administracao());
      jest.spyOn((controller as any).administracaoService, 'delete').mockResolvedValue(false);

      await controller.apagarAdmin(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Falha ao apagar o admin.' });
    });

    it('deve retornar 500 em caso de erro', async () => {
      jest.spyOn((controller as any).administracaoService, 'findByMatricula').mockRejectedValue(new Error('DB Error'));

      await controller.apagarAdmin(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao apagar admin.' });
    });
  });
});
