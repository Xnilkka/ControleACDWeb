import { Request, Response } from 'express';
import { Pessoa } from '../entity/Pessoa';
import { Aluno } from '../entity/Aluno';
import { PessoaService } from '../services/PessoaService';
import { AlunoService } from '../services/AlunoService';
import { Usuario } from '../entity/Usuario';
import { UsuarioService } from '../services/UsuarioService';
import { Professor } from '../entity/Professor';
import { ProfessorService } from '../services/ProfessorService';
import { DisciplinaService } from '../services/DisciplinaService';
import { AlunoDisciplinaService } from '../services/AlunoDisciplinaService';
import { Administracao } from '../entity/Administracao';
import { AdministracaoService } from '../services/AdministracaoService';

export class AdministracaoController {
    private pessoaService = new PessoaService();
    private alunoService = new AlunoService();
    private usuarioService = new UsuarioService();
    private professorService = new ProfessorService();
    private disciplinaService = new DisciplinaService();
    private alunoDisciplinaService = new AlunoDisciplinaService();
    private administracaoService = new AdministracaoService();


    async criarAdmin(req: Request, res: Response): Promise<Response> {
        try {
            const {
                nome,
                sobrenome,
                data_nascimento,
                email,
                telefone,
                cpf
            } = req.body;

            if(!email.endsWith('@email.com')){
                return res.status(400).json({
                    message: 'O email deve terminar com "@email.com".'
                })
            }
            
            const now = new Date();
            const ano = now.getFullYear();
            const semestre = now.getMonth() < 6 ? '01' : '02';

            
            const random = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
            const tipo = '03'; 
            const matricula = `${ano}${semestre}${random}-${tipo}`;

            
            const periodo = `${ano}${semestre}`;
            const data_ingresso = now;

            
            const senha = data_nascimento;
            console.log(typeof data_nascimento, data_nascimento)
            console.log('Senha definida:', senha);


            
            const novaPessoa = new Pessoa();
            novaPessoa.matricula = matricula;
            novaPessoa.nome = nome;
            novaPessoa.sobrenome = sobrenome;
            novaPessoa.data_nascimento = new Date(data_nascimento);
            novaPessoa.email = email;
            novaPessoa.telefone = telefone;
            novaPessoa.cpf = cpf;

            const pessoaCriada = await this.pessoaService.create(novaPessoa);
            
            
            const novoUsuario = new Usuario();
            novoUsuario.pessoaMatricula = matricula;
            novoUsuario.senha = senha;
            novoUsuario.pessoa = pessoaCriada;

            await this.usuarioService.create(novoUsuario);

            
            const novoAdmin = new Administracao();
            novoAdmin.pessoaMatricula = matricula;
            
            
            novoAdmin.pessoa = pessoaCriada;

            const adminCriado = await this.administracaoService.create(novoAdmin);

            return res.status(201).json({
                message: 'Admin criado com sucesso',
                matricula: adminCriado.pessoaMatricula
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao criar Admin' });
        }
    } 
    
    async criarAluno(req: Request, res: Response): Promise<Response> {
        try {
            const {
                nome,
                sobrenome,
                data_nascimento,
                email,
                telefone,
                cpf
            } = req.body;

            if(!email.endsWith('@email.com')){
                return res.status(400).json({
                    message: 'O email deve terminar com "@email.com".'
                })
            }
            
            const now = new Date();
            const ano = now.getFullYear();
            const semestre = now.getMonth() < 6 ? '01' : '02';

            
            const random = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
            const tipo = '01'; 
            const matricula = `${ano}${semestre}${random}-${tipo}`;

            
            const periodo = `${ano}${semestre}`;
            const data_ingresso = now;

            
            const senha = data_nascimento; 

            
            const novaPessoa = new Pessoa();
            novaPessoa.matricula = matricula;
            novaPessoa.nome = nome;
            novaPessoa.sobrenome = sobrenome;
            novaPessoa.data_nascimento = new Date(data_nascimento);
            novaPessoa.email = email;
            novaPessoa.telefone = telefone;
            novaPessoa.cpf = cpf;

            const pessoaCriada = await this.pessoaService.create(novaPessoa);
            
            
            const novoUsuario = new Usuario();
            novoUsuario.pessoaMatricula = matricula;
            novoUsuario.senha = senha;
            novoUsuario.pessoa = pessoaCriada;

            await this.usuarioService.create(novoUsuario);

            
            const novoAluno = new Aluno();
            novoAluno.pessoaMatricula = matricula;
            novoAluno.periodo = periodo;
            novoAluno.data_ingresso = data_ingresso;
            novoAluno.pessoa = pessoaCriada;

            const alunoCriado = await this.alunoService.create(novoAluno);

            return res.status(201).json({
                message: 'Aluno criado com sucesso',
                matricula: alunoCriado.pessoaMatricula
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao criar aluno' });
        }
    }

    async lerAluno(req: Request, res: Response): Promise<Response> {
        try {
            const { matricula } = req.params;

            const aluno = await this.alunoService.findByMatricula(matricula);

            if (!aluno) {
                return res.status(404).json({ message: 'Aluno não encontrado.' });
            }

            return res.status(200).json(aluno);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao buscar aluno.' });
        }
    }

    async lerTodosAlunos(req: Request, res: Response): Promise<Response> {
        try {
            const alunos = await this.alunoService.findAll();

            if (!alunos || alunos.length === 0) {
                return res.status(404).json({ message: 'Nenhum aluno cadastrado.' });
            }

            return res.status(200).json(alunos);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao buscar alunos.' });
        }
    }

    async atualizarAluno(req: Request, res: Response): Promise<Response> {
        try {
            const { matricula } = req.params;
            const dadosAtualizados = req.body;

            const alunoExistente = await this.alunoService.findByMatricula(matricula);

            if (!alunoExistente) {
                return res.status(404).json({ message: 'Aluno não encontrado.' });
            }

            const alunoAtualizado = await this.alunoService.update(matricula, dadosAtualizados);

            return res.status(200).json({
                message: 'Aluno atualizado com sucesso.',
                aluno: alunoAtualizado
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao atualizar aluno.' });
        }
    }

    async apagarAluno(req: Request, res: Response): Promise<Response> {
        try {
            const { matricula } = req.params;

            const alunoExistente = await this.alunoService.findByMatricula(matricula);

            if (!alunoExistente) {
                return res.status(404).json({ message: 'Aluno não encontrado.' });
            }

            const sucesso = await this.alunoService.delete(matricula);

            if (sucesso) {
                return res.status(200).json({ message: 'Aluno apagado com sucesso.' });
            } else {
                return res.status(500).json({ message: 'Falha ao apagar o aluno.' });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao apagar aluno.' });
        }
    }


    async criarProfessor(req: Request, res: Response): Promise<Response> {
        try {
            const {
                nome,
                sobrenome,
                data_nascimento,
                email,
                telefone,
                cpf
            } = req.body;

            if(!email.endsWith('@email.com')){
                return res.status(400).json({
                    message: 'O email deve terminar com "@email.com".'
                })
            }
            
            const now = new Date();
            const ano = now.getFullYear();
            const semestre = now.getMonth() < 6 ? '01' : '02';

            
            const random = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
            const tipo = '02'; 
            const matricula = `${ano}${semestre}${random}-${tipo}`;

            
            
            const data_contrato = now;

            
            const senha = data_nascimento; 

            
            const novaPessoa = new Pessoa();
            novaPessoa.matricula = matricula;
            novaPessoa.nome = nome;
            novaPessoa.sobrenome = sobrenome;
            novaPessoa.data_nascimento = new Date(data_nascimento);
            novaPessoa.email = email;
            novaPessoa.telefone = telefone;
            novaPessoa.cpf = cpf;

            const pessoaCriada = await this.pessoaService.create(novaPessoa);
            
            
            const novoUsuario = new Usuario();
            novoUsuario.pessoaMatricula = matricula;
            novoUsuario.senha = senha;
            novoUsuario.pessoa = pessoaCriada;

            await this.usuarioService.create(novoUsuario);

            
            const novoProfessor = new Professor();
            novoProfessor.pessoaMatricula = matricula;
            novoProfessor.data_contrato = data_contrato;
            novoProfessor.pessoa = pessoaCriada;

            const professorCriado = await this.professorService.create(novoProfessor);

            return res.status(201).json({
                message: 'Professor criado com sucesso',
                matricula: professorCriado.pessoaMatricula
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao criar professor' });
        }
    }


    async lerProfessor(req: Request, res: Response): Promise<Response> {
        try {
            const { matricula } = req.params;

            const professor = await this.professorService.findByMatricula(matricula);

            if (!professor) {
                return res.status(404).json({ message: 'Professor não encontrado.' });
            }

            return res.status(200).json(professor);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao buscar professor.' });
        }
    }

    async lerTodosProfessores(req: Request, res: Response): Promise<Response> {
        try {
            const professores = await this.professorService.findAll();

            if (!professores || professores.length === 0) {
                return res.status(404).json({ message: 'Nenhum professor cadastrado.' });
            }

            return res.status(200).json(professores);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao buscar professores.' });
        }
    }
    

    async atualizarProfessor(req: Request, res: Response): Promise<Response> {
        try {
            const { matricula } = req.params;
            const dadosAtualizados = req.body;

            const professorExistente = await this.professorService.findByMatricula(matricula);

            if (!professorExistente) {
                return res.status(404).json({ message: 'Professor não encontrado.' });
            }

            const professorAtualizado = await this.professorService.update(matricula, dadosAtualizados);

            return res.status(200).json({
                message: 'Professor atualizado com sucesso.',
                professor: professorAtualizado
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao atualizar professor.' });
        }
    }


    async apagarProfessor(req: Request, res: Response): Promise<Response> {
        try {
            const { matricula } = req.params;

            const professorExistente = await this.professorService.findByMatricula(matricula);

            if (!professorExistente) {
                return res.status(404).json({ message: 'Professor não encontrado.' });
            }

            
            if (professorExistente.disciplinas && professorExistente.disciplinas.length > 0) {
                return res.status(400).json({
                    message: 'Não é possível apagar o professor. Ele está vinculado a uma ou mais disciplinas.'
                });
            }

            const sucesso = await this.professorService.delete(matricula);

            if (sucesso) {
                return res.status(200).json({ message: 'Professor apagado com sucesso.' });
            } else {
                return res.status(500).json({ message: 'Falha ao apagar o professor.' });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao apagar professor.' });
        }
    }



    async criarDisciplina(req: Request, res: Response): Promise<Response> {
        try {
            const dados = req.body;

            const disciplinaCriada = await this.disciplinaService.create(dados);

            return res.status(201).json({
                message: 'Disciplina criada com sucesso',
                disciplina: disciplinaCriada
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao criar disciplina.' });
        }
    }

    async lerDisciplina(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;

            const disciplina = await this.disciplinaService.findById(id);

            if (!disciplina) {
                return res.status(404).json({ message: 'Disciplina não encontrada.' });
            }

            return res.status(200).json(disciplina);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao buscar disciplina.' });
        }
    }


    async lerTodasDisciplinas(req: Request, res: Response): Promise<Response> {
        try {
            const disciplinas = await this.disciplinaService.findAll();

            if (!disciplinas || disciplinas.length === 0) {
                return res.status(404).json({ message: 'Nenhuma disciplina cadastrada.' });
            }

            return res.status(200).json(disciplinas);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao buscar disciplinas.' });
        }
    }


    async atualizarDisciplina(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const dadosAtualizados = req.body;

            const disciplinaExistente = await this.disciplinaService.findById(id);

            if (!disciplinaExistente) {
                return res.status(404).json({ message: 'Disciplina não encontrada.' });
            }

            const disciplinaAtualizada = await this.disciplinaService.update(id, dadosAtualizados);

            return res.status(200).json({
                message: 'Disciplina atualizada com sucesso.',
                disciplina: disciplinaAtualizada
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao atualizar disciplina.' });
        }
    }


    async apagarDisciplina(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;

            const disciplinaExistente = await this.disciplinaService.findById(id);

            if (!disciplinaExistente) {
                return res.status(404).json({ message: 'Disciplina não encontrada.' });
            }

            
            if (disciplinaExistente.professor) {
                return res.status(400).json({
                    message: 'Não é possível apagar a disciplina. Há um professor vinculado.'
                });
            }

            const sucesso = await this.disciplinaService.delete(id);

            if (sucesso) {
                return res.status(200).json({ message: 'Disciplina apagada com sucesso.' });
            } else {
                return res.status(500).json({ message: 'Falha ao apagar a disciplina.' });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao apagar disciplina.' });
        }
    }



    async vincularProfessor(req: Request, res: Response): Promise<Response> {
        try {
            const { disciplinaId, professorMatricula } = req.body;

            const professor = await this.professorService.findByMatricula(professorMatricula);
            const disciplina = await this.disciplinaService.findById(disciplinaId);

            if (!professor) {
                return res.status(404).json({ message: 'Professor não encontrado.' });
            }

            if (!disciplina) {
                return res.status(404).json({ message: 'Disciplina não encontrada.' });
            }

            disciplina.professor = professor;
            const atualizada = await this.disciplinaService.update(disciplinaId, {
                professor: professor
            });

            if (!atualizada) {
                return res.status(500).json({ message: 'Falha ao atualizar a disciplina.' });
            }


            return res.status(200).json({
                message: 'Professor vinculado à disciplina com sucesso.',
                disciplina: atualizada
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao vincular professor à disciplina.' });
        }
    }




    async desvincularProfessor(req: Request, res: Response): Promise<Response> {
        try {
            const { disciplinaId } = req.params;

            const disciplina = await this.disciplinaService.findById(disciplinaId);

            if (!disciplina) {
                return res.status(404).json({ message: 'Disciplina não encontrada.' });
            }


            if (!disciplina.professor) {
                return res.status(400).json({ message: 'Nenhum professor está vinculado a esta disciplina.' });
            }

            
            await this.disciplinaService.removeProfessorFromDisciplina(disciplinaId);

            const atualizada = await this.disciplinaService.findById(disciplinaId);


            return res.status(200).json({ message: 'Professor desvinculado da disciplina com sucesso.', disciplina: atualizada });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao desvincular professor da disciplina.' });
        }
    }


    async vincularAlunoADisciplina(req: Request, res: Response): Promise<Response> {
        try {
            const { alunoMatricula, disciplinaId, turno, data_inicio_semestre, data_termino_semestre } = req.body;

            const aluno = await this.alunoService.findByMatricula(alunoMatricula);
            const disciplina = await this.disciplinaService.findById(disciplinaId);

            if (!aluno) {
                return res.status(404).json({ message: 'Aluno não encontrado.' });
            }

            if (!disciplina) {
                return res.status(404).json({ message: 'Disciplina não encontrada.' });
            }

            const existe = await this.alunoDisciplinaService.findByIds(alunoMatricula, disciplinaId);
            if (existe) {
                return res.status(400).json({ message: 'Aluno já está matriculado nessa disciplina.' });
            }

            const matricula = await this.alunoDisciplinaService.create({
                alunoMatricula,
                disciplinaId,
                aluno,
                disciplina,
                turno,
                data_inicio_semestre: new Date(data_inicio_semestre),
                data_termino_semestre: new Date(data_termino_semestre),
                nota_1: null,
                nota_2: null,
                media: null
            });

            return res.status(201).json({ message: 'Aluno vinculado à disciplina com sucesso.', matricula });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao vincular aluno à disciplina.' });
        }
    }

    async atualizarNota(req: Request, res: Response): Promise<Response> {
        try {
            const { alunoMatricula, disciplinaId } = req.params;
            const { nota_1, nota_2 } = req.body;

            
            if (nota_1 !== undefined && (nota_1 < 0 || nota_1 > 10)) {
                return res.status(400).json({ message: 'Nota 1 deve estar entre 0 e 10.' });
            }

            if (nota_2 !== undefined && (nota_2 < 0 || nota_2 > 10)) {
                return res.status(400).json({ message: 'Nota 2 deve estar entre 0 e 10.' });
            }

            const matricula = await this.alunoDisciplinaService.findByIds(alunoMatricula, disciplinaId);
            if (!matricula) {
                return res.status(404).json({ message: 'Matrícula de aluno na disciplina não encontrada.' });
            }

            if (nota_1 !== undefined) matricula.nota_1 = parseFloat(nota_1);
            if (nota_2 !== undefined) matricula.nota_2 = parseFloat(nota_2);

            if (matricula.nota_1 != null && matricula.nota_2 != null) {
                matricula.media = Number(((matricula.nota_1 + matricula.nota_2) / 2).toFixed(2));
            }

            const atualizada = await this.alunoDisciplinaService.update(alunoMatricula, disciplinaId, matricula);

            return res.status(200).json({ message: 'Nota(s) atualizada(s) com sucesso.', matricula: atualizada });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao atualizar nota.' });
        }
    }






}
