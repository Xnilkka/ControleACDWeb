import { Request, Response } from 'express';
import { ProfessorService } from "../services/ProfessorService";
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
}