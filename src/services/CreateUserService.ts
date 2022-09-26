import { DataSource, Repository } from "typeorm";
import { User } from "../entity/User";
import bcyrpt from "bcryptjs";
import { FindUserService } from "./FindUserService";

export class CreateUserService {
  private user_repo: Repository<User>;
  private find_user_service: FindUserService;

  constructor(data_source: DataSource) {
    this.user_repo = data_source.getRepository(User);
    this.find_user_service = new FindUserService(data_source);
  }

  public async register(email: string, password: string) {
    const existing_user = await this.find_user_service.findByEmail(email);

    if (existing_user) {
      throw new Error("User Already Exists");
    }

    const password_hash = await bcyrpt.hash(password, 10);

    return this.user_repo.save({
      email,
      password: password_hash,
    });
  }
}
