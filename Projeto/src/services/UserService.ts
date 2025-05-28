
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

export class UserService {
    private userRepo = AppDataSource.getRepository(User);

    async createUser(name: string, email: string): Promise<User>{

        const user = this.userRepo.create({name, email});
        return await this.userRepo.save(user);
    }

    async getAllUsers(): Promise<User[]>{
        return await this.userRepo.find();
    }
}