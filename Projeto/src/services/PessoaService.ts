import { AppDataSource } from "../data-source";
import { Aluno } from "../entity/Aluno";
import { Pessoa } from "../entity/Pessoa";
import { Professor } from "../entity/Professor";
import { Usuario } from "../entity/Usuario";

export class PessoaService {
    private repo = AppDataSource.getRepository(Pessoa);
    private usuarioRepo = AppDataSource.getRepository(Usuario);
    private professorRepo = AppDataSource.getRepository(Professor);
    private alunoRepo = AppDataSource.getRepository(Aluno);

    async create(pessoa: Pessoa): Promise<Pessoa> {
        const nova = this.repo.create(pessoa);
        return await this.repo.save(nova);
    }

    async findAll(): Promise<Pessoa[]> {
        return await this.repo.find();
    }

    async findByMatricula(matricula: string): Promise<Pessoa | null> {
        return await this.repo.findOne({ where: { matricula } });
    }

    async update(matricula: string, data: Partial<Pessoa>): Promise<Pessoa | null> {
        await this.repo.update(matricula, data);
        return await this.findByMatricula(matricula);
    }


    async delete(matricula: string): Promise<boolean> {
        const pessoa = await this.findByMatricula(matricula);

        if(!pessoa){
            return false;
        }

        await this.repo.delete(matricula);

        await this.usuarioRepo.delete({pessoaMatricula: matricula});

        if(pessoa.professor){
            await this.professorRepo.delete(matricula);
            return true;
        }

        await this.alunoRepo.delete(matricula);
        return true;

    }
}
