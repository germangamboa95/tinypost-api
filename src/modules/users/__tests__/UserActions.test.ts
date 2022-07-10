import { createUser, findUserByUsername } from "../UserActions";
import { User } from "../UserDAL";

jest.mock("../UserDAL");

describe("UserActions Suite", () => {
  it("can create a user with hashed password", async () => {
    const model_spy = jest.spyOn(User, "create");
    await createUser({
      username: "testicle",
      password: "testicles",
    });

    expect(model_spy).toBeCalledTimes(1);
  });

  it("can find a user by username", async () => {
    const model_spy = jest.spyOn(User, "findOne");
    await findUserByUsername("testicle");

    expect(model_spy).toBeCalledTimes(1);
  });
});
