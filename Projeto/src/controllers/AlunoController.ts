import { Request, Response } from 'express';
import { AlunoService } from "../services/AlunoService";
require('dotenv').config();

export class AlunoController{
    private alunoService = new AlunoService();
        
    async lerAluno(req: Request, res: Response): Promise<Response> {
        try {
            const userpayload = req.user;

            if (!userpayload) {
                return res.status(401).json({ mensagem: "Nenhum payload do usuário carregado" });
            }

            const aluno = await this.alunoService.findByMatricula(userpayload.role);

            if (!aluno) {
                return res.status(404).json({ message: 'Aluno não encontrado.' });
            }

            return res.status(200).json(aluno);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao buscar aluno.' });
        }
    }

        async atualizarAluno(req: Request, res: Response): Promise<Response> {
        try {
            const userpayload = req.user;
            const dadosAtualizados = req.body;

            if (!userpayload) {
                return res.status(401).json({ mensagem: "Nenhum payload do usuário carregado" });
            }

            const alunoExistente = await this.alunoService.findByMatricula(userpayload.role);

            if (!alunoExistente) {
                return res.status(404).json({ message: 'Aluno não encontrado.' });
            }

            const alunoAtualizado = await this.alunoService.update(userpayload.role, dadosAtualizados);

            return res.status(200).json({
                message: 'Aluno atualizado com sucesso.',
                aluno: alunoAtualizado
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao atualizar professor.' });
        }
    }
}