import { DataSource, Repository } from "typeorm";
import { Post } from "../entity/Post";
import { Tag } from "../entity/Tag";

export class TagPostService {
  private post_repo: Repository<Post>;

  constructor(data_source: DataSource) {
    this.post_repo = data_source.getRepository(Post);
  }

  public async assignTag(post: Post, tag: Tag) {
    return await this.assignTags(post, [tag]);
  }

  public async assignTags(post: Post, tags: Tag[]) {
    post?.tags ? post.tags.push(...tags) : (post.tags = [...tags]);

    return this.post_repo.save(post);
  }
}
