import { Repository, DataSource } from "typeorm";
import { Post } from "../entity/Post";
import { User } from "../entity/User";

export class PostQueryService {
  private post_repo: Repository<Post>;

  constructor(data_source: DataSource) {
    this.post_repo = data_source.getRepository(Post);
  }

  public async fetchLatest(page_size: number = 10, page_number: number = 1) {
    return this.post_repo
      .createQueryBuilder("posts")
      .orderBy("posts.created_at", "DESC")
      .skip(page_size * page_number)
      .take(page_size)
      .getMany();
  }
}
