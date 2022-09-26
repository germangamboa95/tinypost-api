import { DataSource, Repository } from "typeorm";
import { Post } from "../entity/Post";
import { Tag } from "../entity/Tag";

export class TagPostService {
  private post_repo: Repository<Post>;

  constructor(data_source: DataSource) {
    this.post_repo = data_source.getRepository(Post);
  }

  public async assignTag(post: Post, tag: Tag) {
    post?.tags ? post.tags.push(tag) : (post.tags = [tag]);
    return this.post_repo.save(post);
  }
}
