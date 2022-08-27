import { db } from "../../../db";
import { UserRepository } from "../UserRepository";

describe("UserRepository test", () => {
  beforeEach(async () => {
    await db.migrate.latest();
  });

  afterEach(async () => {
    await db.destroy();
  });

  it("hey", async () => {
    const user_repo = new UserRepository(db);

    await user_repo.createUser("germangamboa95@gmail.com");

    const user = await user_repo.findbyEmail("germangamboa95@gmail.com");

    console.log(user);
    expect(1).toBe(1);
  });
});
