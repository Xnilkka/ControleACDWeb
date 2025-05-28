import { AppDataSource } from "../data-source";
import { Administracao } from "../entity/Administracao";
import { Pessoa } from "../entity/Pessoa";

export class AdministracaoService {
    private repo = AppDataSource.getRepository(Administracao);
    private pessoaRepo = AppDataSource.getRepository(Pessoa);

    async create(adm: Administracao): Promise<Administracao> {
        const novo = this.repo.create(adm);
        return await this.repo.save(novo);
    }

    async findAll(): Promise<Administracao[]> {
        return await this.repo.find({ relations: ["pessoa"] });
    }

    async findByMatricula(matricula: string): Promise<Administracao | null> {
        return await this.repo.findOne({ where: { pessoaMatricula: matricula }, relations: ["pessoa"] });
    }


    async update(matricula: string, data: Partial<Administracao & {pessoa?: Partial<Pessoa>}>): Promise<Administracao | null>  {
        if(data.pessoa){
            await this.pessoaRepo.update(matricula,data.pessoa);
        }

        // Remove o campo pessoa antes de atualizar o Aluno
        // ...  agrupa todas as outras propriedades do objeto data que não são pessoa em um novo objeto chamado administracaoData
        const { pessoa, ...administracaoData } = data;
        await this.repo.update(matricula, administracaoData);

        return await this.findByMatricula(matricula);
    }

    async delete(matricula: string): Promise<boolean> {
        const res = await this.repo.delete(matricula);
        return res.affected! > 0;
    }
}
