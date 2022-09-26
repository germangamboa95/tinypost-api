import { User } from "../entity/User";
import bcyrpt from "bcryptjs";

export class BasicAuthenticationService {
  private user: User;

  constructor(user: User) {
    this.user = user;
  }

  public async check(password: string) {
    if (await this.isValidPassword(password, this.user.password)) {
      return true;
    }
    return false;
  }

  private async isValidPassword(password: string, hashed_password: string) {
    return bcyrpt.compare(password, hashed_password);
  }
}
