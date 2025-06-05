import { AppDataSource } from "../data-source";
import { Professor } from "../entity/Professor";
import { Pessoa } from "../entity/Pessoa";
import { Usuario } from "../entity/Usuario";

export class ProfessorService {
    private repo = AppDataSource.getRepository(Professor);
    private pessoaRepo = AppDataSource.getRepository(Pessoa);
    private usuarioRepo = AppDataSource.getRepository(Usuario);

    async create(prof: Professor): Promise<Professor> {
        const novo = this.repo.create(prof);
        return await this.repo.save(novo);
    }

    async findAll(): Promise<Professor[]> {
        return await this.repo.find({ relations: ["pessoa", "disciplinas"] });
    }

    async findByMatricula(matricula: string): Promise<Professor | null> {
        return await this.repo.findOne({
            where: { pessoaMatricula: matricula },
            relations: ["pessoa", "disciplinas"]  // <- importante
        });
    }



    async update(matricula: string, data: Partial<Professor & {pessoa?: Partial<Pessoa>}>): Promise<Professor | null>  {

        // Remove o campo pessoa antes de atualizar o Aluno
        // ...  isso aqui é pra agrupar todas as outras propriedades do objeto data que não são pessoa em um novo objeto chamado professorData
        const { pessoa, ...professorData } = data;

        if(pessoa && Object.keys(pessoa).length > 0){
            await this.pessoaRepo.update(matricula,pessoa);
        }

        if(professorData && Object.keys(professorData).length > 0){
            await this.repo.update(matricula, professorData);
        }

        return await this.findByMatricula(matricula);
    }




    async delete(matricula: string): Promise<boolean> {
        const professor = await this.findByMatricula(matricula);

        if(!professor){
            return false;
        }

        
        await this.repo.delete(matricula);

        
        await this.usuarioRepo.delete({pessoaMatricula: matricula});

        
        await this.pessoaRepo.delete(matricula);

        return true;
    }
}
