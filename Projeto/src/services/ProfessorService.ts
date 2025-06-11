import { AppDataSource } from "../data-source";
import { Professor } from "../entity/Professor";
import { Pessoa } from "../entity/Pessoa";
import { Usuario } from "../entity/Usuario";
import { AlunoDisciplina } from "../entity/Aluno_Disciplina";

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

    async findAlunosPorDisciplina(disciplinaId: string): Promise<AlunoDisciplina[]> {
        const alunoDisciplinaRepo = AppDataSource.getRepository(AlunoDisciplina);

        return await alunoDisciplinaRepo.find({
            where: { disciplina: { id: disciplinaId } },
            relations: [
                "aluno",
                "aluno.pessoa",
                "disciplina"
            ]
        });
    }

    async atualizarNotasAluno(data: {
        alunoMatricula: string,
        disciplinaId: string,
        nota_1?: number,
        nota_2?: number
    }): Promise<AlunoDisciplina | null> {
        const alunoDisciplinaRepo = AppDataSource.getRepository(AlunoDisciplina);

        const registro = await alunoDisciplinaRepo.findOne({
            where: {
                alunoMatricula: data.alunoMatricula,
                disciplina: { id: data.disciplinaId }
            },
            relations: ["aluno", "disciplina"]
        });

        if (!registro) {
            return null;
        }

        if (data.nota_1 !== undefined) registro.nota_1 = Number(data.nota_1);
        if (data.nota_2 !== undefined) registro.nota_2 = Number(data.nota_2);

        // Calcular média, se ambas as notas estiverem presentes
        if (registro.nota_1 != null && registro.nota_2 != null) {
            registro.media = Number(((registro.nota_1 + registro.nota_2) / 2).toFixed(2));
        }

        return await alunoDisciplinaRepo.save(registro);
    }
}
