import { data_source_test } from "../../db";
import { CreatePostService } from "../CreatePostService";
import { CreateUserService } from "../CreateUserService";

describe("CreatePostService tests", () => {
  beforeEach(async () => {
    await data_source_test.initialize();
    await data_source_test.synchronize(true);
  });

  it("it can create post", async () => {
    const create_user_service = new CreateUserService(data_source_test);

    const user = await create_user_service.register(
      "germangamboa95@gmail.com",
      "password"
    );

    const create_post_service = new CreatePostService(data_source_test);

    create_post_service.setUser(user);

    const post = await create_post_service.createPost(
      "Some webpage",
      "germangamboa.com",
      []
    );

    expect(post.title).toBe("Some webpage");
    expect(post.user.id).toBe(user.id);
  });
});
