import { AppDataSource } from "../data-source";
import { Aluno } from "../entity/Aluno";
import { Pessoa } from "../entity/Pessoa";
import { Professor } from "../entity/Professor";
import { Usuario } from "../entity/Usuario";
import bcrypt from 'bcrypt';

export class UsuarioService {
    private repo = AppDataSource.getRepository(Usuario);
    private pessoaRepo = AppDataSource.getRepository(Pessoa);
    private professorRepo = AppDataSource.getRepository(Professor);
    private alunoRepo = AppDataSource.getRepository(Aluno);

    async create(usuario: Usuario): Promise<Usuario> {
        const novo = this.repo.create(usuario);
        return await this.repo.save(novo);
    }

    async findAll(): Promise<Usuario[]> {
        return await this.repo.find({ relations: ["pessoa"] });
    }

    async findByMatricula(matricula: string): Promise<Usuario | null> {
        return await this.repo.findOne({ where: { pessoaMatricula: matricula }, relations: ["pessoa"] });
    }



    async update(matricula: string, data: Partial<Usuario & {pessoa?: Partial<Pessoa>}>): Promise<Usuario | null>  {

        // Removi o campo pessoa antes de atualizar o Aluno
        // ...  isso aqui é pra agrupar todas as outras propriedades do objeto data que não são pessoa em um novo objeto chamado usuarioData
        const { pessoa, ...usuarioData } = data;

        if(pessoa && Object.keys(pessoa).length > 0){
            await this.pessoaRepo.update(matricula, pessoa);
        }

        if(usuarioData && Object.keys(usuarioData).length > 0){
            await this.repo.update(matricula,usuarioData);
        }

        return await this.findByMatricula(matricula);
    }



    async delete(matricula: string): Promise<boolean> {
        const usuario = this.findByMatricula(matricula);

        if(!usuario) {
            return false;
        }

        await this.repo.delete({pessoaMatricula: matricula});

        const pessoa = await this.pessoaRepo.findOne({where: {matricula}})

        if(pessoa?.professor) {
            await this.professorRepo.delete(matricula);
            await this.pessoaRepo.delete(matricula);
            return true;
        }

        await this.alunoRepo.delete(matricula);
        await this.pessoaRepo.delete(matricula);
        return true
    }

    async checkPassword(senha: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(senha, hash);
    }


}
