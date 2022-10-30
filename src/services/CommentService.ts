import { DataSource, Repository } from "typeorm";
import { Comment } from "../entity/Comment";
import { User } from "../entity/User";

export class CommentService {
  private comment_repo: Repository<Comment>;
  private user: User;

  public constructor(data_source: DataSource) {
    this.comment_repo = data_source.getRepository(Comment);
  }

  public setUser(user: User) {
    this.user = user;
  }

  public async addComment(comment: string, post_id: number) {
    return await this.comment_repo.save({
      content: comment,
      post_id: post_id,
      user: this.user,
    });
  }

  public async getComments(post_id: number) {
    return this.comment_repo.find({
      where: {
        post_id,
      },
    });
  }
}
