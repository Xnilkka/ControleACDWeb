import { AppDataSource } from "../data-source";
import { AlunoDisciplina } from "../entity/Aluno_Disciplina";

export class AlunoDisciplinaService {
    private repo = AppDataSource.getRepository(AlunoDisciplina);

    async create(ad: AlunoDisciplina): Promise<AlunoDisciplina> {
        const novo = this.repo.create(ad);
        return await this.repo.save(novo);
    }

    async findAll(): Promise<AlunoDisciplina[]> {
        return await this.repo.find({ relations: ["aluno", "disciplina"] });
    }

    async findByIds(alunoMatricula: string, disciplinaId: string): Promise<AlunoDisciplina | null> {
        return await this.repo.findOne({
            where: { alunoMatricula, disciplinaId },
            relations: ["aluno", "disciplina"]
        });
    }

    async update(alunoMatricula: string, disciplinaId: string, data: Partial<AlunoDisciplina>): Promise<AlunoDisciplina | null> {
        await this.repo.update({ alunoMatricula, disciplinaId }, data);
        return await this.findByIds(alunoMatricula, disciplinaId);
    }

    async delete(alunoMatricula: string, disciplinaId: string): Promise<boolean> {
        const res = await this.repo.delete({ alunoMatricula, disciplinaId });
        return res.affected! > 0;
    }
}
