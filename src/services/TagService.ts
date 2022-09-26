import { DataSource, Repository } from "typeorm";
import { Post } from "../entity/Post";
import { Tag } from "../entity/Tag";

export class CreatePostService {
  private post_repo: Repository<Post>;

  constructor(data_source: DataSource) {
    this.post_repo = data_source.getRepository(Post);
  }

  public assignTag(post: Post, tag: Tag) {
    post.tags.push(tag);
    return this.post_repo.save(post);
  }
}
