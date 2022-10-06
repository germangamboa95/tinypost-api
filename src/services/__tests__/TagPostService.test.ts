import { data_source_test } from "../../db";
import { CreatePostService } from "../CreatePostService";
import { CreateTagService } from "../CreateTagService";
import { CreateUserService } from "../CreateUserService";
import { TagPostService } from "../TagPostService";

describe("TagService tests", () => {
  beforeEach(async () => {
    await data_source_test.initialize();
    await data_source_test.synchronize(true);
  });

  afterEach(async () => {
    await data_source_test.destroy();
  });

  it("it can tag a post", async () => {
    const service = new CreateTagService(data_source_test);

    const tag = await service.upsertTag("tag_random");

    const tag_two = await service.upsertTag("tag_random_2");

    const create_user_service = new CreateUserService(data_source_test);

    const user = await create_user_service.register(
      "germangamboa95@gmail.com",
      "password"
    );

    const create_post_service = new CreatePostService(data_source_test);

    create_post_service.setUser(user);

    const post = await create_post_service.createPost(
      "Some webpage",
      "germangamboa.com"
    );

    const tag_post_service = new TagPostService(data_source_test);

    await tag_post_service.assignTag(post, tag);

    await tag_post_service.assignTag(post, tag_two);

    expect(post.tags.length).toBe(2);
  });
});
