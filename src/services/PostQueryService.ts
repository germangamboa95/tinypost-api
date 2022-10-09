import { Repository, DataSource } from "typeorm";
import { Post } from "../entity/Post";

export class PostQueryService {
  private post_repo: Repository<Post>;

  constructor(data_source: DataSource) {
    this.post_repo = data_source.getRepository(Post);
  }

  public async fetchLatest(page_size: number = 10, page_number: number = 1) {
    return this.post_repo
      .createQueryBuilder("posts")
      .leftJoinAndSelect("posts.tags", "tag")
      .orderBy("posts.created_at", "DESC")
      .skip(page_size * page_number - page_size)
      .take(page_size)
      .getMany();
  }
  public async fetchLatestByUser(
    page_size: number = 10,
    page_number: number = 1,
    user_id: number
  ) {
    return this.post_repo
      .createQueryBuilder("posts")
      .leftJoinAndSelect("posts.tags", "tag")
      .where("posts.user_id = :user_id", { user_id })
      .orderBy("posts.created_at", "DESC")
      .skip(page_size * page_number - page_size)
      .take(page_size)
      .getMany();
  }
}
