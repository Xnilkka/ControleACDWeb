import { AppDataSource } from "../data-source";
import { Aluno } from "../entity/Aluno";
import { Pessoa } from "../entity/Pessoa";
import { Usuario } from "../entity/Usuario";

export class AlunoService {
    private repo = AppDataSource.getRepository(Aluno);
    private pessoaRepo = AppDataSource.getRepository(Pessoa);
    private usuarioRepo = AppDataSource.getRepository(Usuario);

    async create(aluno: Aluno): Promise<Aluno> {
        const novo = this.repo.create(aluno);
        return await this.repo.save(novo);
    }

    async findAll(): Promise<Aluno[]> {
        return await this.repo.find({ relations: ["pessoa", "matriculasDisciplinas"] });
    }

    async findByMatricula(matricula: string): Promise<Aluno | null> {
        return await this.repo.findOne({ where: { pessoaMatricula: matricula }, relations: ["pessoa", "matriculasDisciplinas"] });
    }



    //Aqui ta sobrescrevendo o atributo do pessoa de Aluno com o atributo pessoa de {} que contem os campos opcionais
    async update(matricula: string, data: Partial<Aluno & { pessoa?: Partial<Pessoa> }>): Promise<Aluno | null> {
    // Atualiza campos de Pessoa se vierem no objeto
        if (data.pessoa) {
            await this.pessoaRepo.update(matricula, data.pessoa);
        }

        const { pessoa, ...alunoData } = data;
        await this.repo.update(matricula, alunoData);

        return await this.findByMatricula(matricula);
}


    async delete(matricula: string): Promise<boolean> {
        const aluno = await this.findByMatricula(matricula);

        if (!aluno) {
            return false;
        }

        
        await this.repo.delete(matricula);

        
        await this.usuarioRepo.delete({ pessoaMatricula: matricula });

        
        await this.pessoaRepo.delete(matricula);

        return true;
    }

}
