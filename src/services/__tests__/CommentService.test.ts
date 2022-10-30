import { data_source_test } from "../../db";
import { CommentService } from "../CommentService";
import { CreatePostService } from "../CreatePostService";
import { CreateUserService } from "../CreateUserService";

describe("CommentService", () => {
  beforeEach(async () => {
    await data_source_test.initialize();
    await data_source_test.synchronize(true);
  });

  it("can create comment on post", async () => {
    const comment_service = new CommentService(data_source_test);

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

    comment_service.setUser(user);

    const comment = await comment_service.addComment(
      "This is a comment",
      post.id
    );

    expect(comment.post_id).toBe(post.id);

    expect(comment.content).toBe("This is a comment");
  });
});
