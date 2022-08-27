import { Knex } from "knex";

interface User {
  email: string;
  created_at: Date;
  updated_at: Date;
}

const USER_TABLE = "users";

export class UserRepository {
  private db: Knex;

  public constructor(db: Knex) {
    this.db = db;
  }

  private queryBuilder() {
    return this.db.from<User>(USER_TABLE);
  }

  public async createUser(email: string) {
    await this.queryBuilder().insert({
      email,
      updated_at: new Date(),
      created_at: new Date(),
    });
  }

  public async findbyEmail(email: string) {
    const result = await this.queryBuilder().where("email", email);

    if (result.length === 0) {
      return null;
    }

    return result[0];
  }

  public async deleteByEmail(email: string) {
    return this.queryBuilder().where("email", email).delete();
  }
}
