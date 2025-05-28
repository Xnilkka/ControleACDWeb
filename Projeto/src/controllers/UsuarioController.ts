import { UsuarioService} from "../services/UsuarioService";
import { Request, Response } from 'express';
import jwt from "jsonwebtoken";



export class UsuarioController{
    private usuarioService = new UsuarioService();


    async login(req: Request, res: Response): Promise<Response> {
        const { matricula, senha } = req.body;
        const secretKey = process.env.SECRET_KEY;

        console.log("Chave secreta:", secretKey);
        if (!secretKey) {
        return res.status(500).json({ mensagem: "Chave secreta não configurada." });
        }
        const user = await this.usuarioService.findByMatricula(matricula);

        
        if (!user) {
            return res.status(401).json({ mensagem: "SEM USUARIO" });
        }

        if (!user || !(await this.usuarioService.checkPassword(senha, user.senha))) {
            return res.status(401).json({ mensagem: "Credenciais inválidas!" });
        }

        const token = jwt.sign({ id: user.id, role: user.pessoaMatricula }, secretKey, {
                expiresIn: "1h",
            });

            return res.json({ mensagem: "Login bem-sucedido!", token });
    }


    async updateYourselfPass(req: Request, res: Response): Promise<Response> {
    try {
        const { senha } = req.body;
        const userpayload = req.user;

        if (!userpayload) {
            return res.status(401).json({ mensagem: "Nenhum payload do usuário carregado" });
        }

        await this.usuarioService.update(userpayload.role, { senha });

        return res.status(200).json({
            mensagem: "Senha do usuário atualizada com sucesso"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "Erro ao atualizar a senha" });
    }
}


}