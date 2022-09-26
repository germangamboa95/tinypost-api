import { DataSource, Repository } from "typeorm";
import { Post } from "../entity/Post";
import { User } from "../entity/User";

export class CreatePostService {
  private post_repo: Repository<Post>;
  private user: User;

  constructor(data_source: DataSource) {
    this.post_repo = data_source.getRepository(Post);
  }

  public setUser(user: User) {
    this.user = user;
  }

  public createPost(title: string, url: string) {
    return this.post_repo.save({
      title,
      url,
      user: this.user,
    });
  }
}
