import { DataSource, Repository } from "typeorm";
import { Post } from "../entity/Post";
import { User } from "../entity/User";
import { CreateTagService } from "./CreateTagService";
import { TagPostService } from "./TagPostService";

export class CreatePostService {
  private post_repo: Repository<Post>;
  private user: User;
  private create_tag_service: CreateTagService;
  private tag_post_service: TagPostService;

  constructor(data_source: DataSource) {
    this.post_repo = data_source.getRepository(Post);

    this.create_tag_service = new CreateTagService(data_source);
    this.tag_post_service = new TagPostService(data_source);
  }

  public setUser(user: User) {
    this.user = user;
  }

  public async createPost(title: string, url: string, tags: string[]) {
    const saved_post = await this.post_repo.save({
      title,
      url,
      user: this.user,
    });

    const saved_tags = await Promise.all(
      tags.map(this.create_tag_service.upsertTag.bind(this.create_tag_service))
    );

    await this.tag_post_service.assignTags(saved_post, saved_tags);

    return saved_post;
  }
}
