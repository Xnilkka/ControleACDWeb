import { AppDataSource } from "../data-source";
import { Disciplina } from "../entity/Disciplina";

export class DisciplinaService {
    private repo = AppDataSource.getRepository(Disciplina);

    async create(d: Disciplina): Promise<Disciplina> {
        const nova = this.repo.create(d);
        return await this.repo.save(nova);
    }

    async findAll(): Promise<Disciplina[]> {
        return await this.repo.find({ relations: ["professor", "matriculasAlunos"] });
    }

    async findById(id: string): Promise<Disciplina | null> {
        return await this.repo.findOne({ where: { id }, relations: ["professor", "matriculasAlunos"] });
    }

    async update(id: string, data: Partial<Disciplina>): Promise<Disciplina | null> {
        await this.repo.update(id, data);
        return await this.findById(id);
    }

    async delete(id: string): Promise<boolean> {
        const res = await this.repo.delete(id);
        return res.affected! > 0;
    }

    async removeProfessorFromDisciplina(disciplinaId: string): Promise<void> {
    await this.repo
        .createQueryBuilder()
        .update()
        .set({ professor: null as any})
        .where("id = :id", { id: disciplinaId })
        .execute();
}

}
