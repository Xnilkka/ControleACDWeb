import { Request, Response } from 'express';
import { ProfessorService } from "../services/ProfessorService";
import { AlunoDisciplina } from '../entity/Aluno_Disciplina';
require('dotenv').config();

export class ProfessorController{
    private professorService = new ProfessorService();
        
    async lerProfessor(req: Request, res: Response): Promise<Response> {
        try {
            const userpayload = req.user;

            if (!userpayload) {
                return res.status(401).json({ mensagem: "Nenhum payload do usuário carregado" });
            }

            const professor = await this.professorService.findByMatricula(userpayload.role);

            if (!professor) {
                return res.status(404).json({ message: 'Professor não encontrado.' });
            }

            return res.status(200).json(professor);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao buscar professor.' });
        }
    }

        async atualizarProfessor(req: Request, res: Response): Promise<Response> {
        try {
            const userpayload = req.user;
            const dadosAtualizados = req.body;

            if (!userpayload) {
                return res.status(401).json({ mensagem: "Nenhum payload do usuário carregado" });
            }

            const professorExistente = await this.professorService.findByMatricula(userpayload.role);

            if (!professorExistente) {
                return res.status(404).json({ message: 'Professor não encontrado.' });
            }

            const professorAtualizado = await this.professorService.update(userpayload.role, dadosAtualizados);

            return res.status(200).json({
                message: 'Professor atualizado com sucesso.',
                professor: professorAtualizado
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao atualizar professor.' });
        }
    }


    async buscarAlunosPorDisciplina(req: Request, res: Response): Promise<Response> {
        try {
            const userpayload = req.user;

            if (!userpayload) {
                return res.status(401).json({ mensagem: "Nenhum payload do usuário carregado" });
            }

            const professor = await this.professorService.findByMatricula(userpayload.role);

            if (!professor || !professor.disciplinas) {
                return res.status(404).json({ message: 'Professor ou disciplinas não encontradas.' });
            }

            const resultado: any[] = [];

            for (const disciplina of professor.disciplinas) {
                const alunosMatriculados = await this.professorService.findAlunosPorDisciplina(disciplina.id);

                resultado.push({
                    disciplina: {
                        id: disciplina.id,
                        nome: disciplina.nome,
                        carga_horaria: disciplina.carga_horaria
                    },
                    alunos: alunosMatriculados.map((registro: AlunoDisciplina) => ({
                        matricula: registro.aluno.pessoaMatricula,
                        nome: registro.aluno.pessoa.nome,
                        sobrenome: registro.aluno.pessoa.sobrenome,
                        email: registro.aluno.pessoa.email,
                        nota_1: registro.nota_1,
                        nota_2: registro.nota_2,
                        media: registro.media
                    }))
                });
            }

            return res.status(200).json(resultado);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao buscar alunos por disciplina.' });
        }
    }

    async atribuirNotas(req: Request, res: Response): Promise<Response> {
        try {
            const userPayload = req.user;
            const { alunoMatricula, disciplinaId, nota_1, nota_2 } = req.body;

            if (!userPayload) {
                return res.status(401).json({ mensagem: "Usuário não autenticado." });
            }

            if (!alunoMatricula || !disciplinaId) {
                return res.status(400).json({ mensagem: "alunoMatricula e disciplinaId são obrigatórios." });
            }

            // Verifica se o professor ministra a disciplina
            const professor = await this.professorService.findByMatricula(userPayload.role);

            if (!professor || !professor.disciplinas?.some(d => d.id === disciplinaId)) {
                return res.status(403).json({ mensagem: "Você não tem permissão para lançar notas nessa disciplina." });
            }

            if (nota_1 !== undefined && (nota_1 < 0 || nota_1 > 10)) {
                return res.status(400).json({ message: 'Nota 1 deve estar entre 0 e 10.' });
            }

            if (nota_2 !== undefined && (nota_2 < 0 || nota_2 > 10)) {
                return res.status(400).json({ message: 'Nota 2 deve estar entre 0 e 10.' });
            }

            // Atualiza as notas
            const resultado = await this.professorService.atualizarNotasAluno({
                alunoMatricula,
                disciplinaId,
                nota_1,
                nota_2
            });

            if (!resultado) {
                return res.status(404).json({ mensagem: "Matrícula do aluno na disciplina não encontrada." });
            }

            return res.status(200).json({
                mensagem: "Notas atualizadas com sucesso.",
                registro: resultado
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensagem: "Erro ao atualizar notas do aluno." });
        }
    }


}