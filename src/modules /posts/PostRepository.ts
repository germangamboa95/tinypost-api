import { Knex } from "knex";

interface Post {
  id?: number;
  title: string;
  type: string;
  content: string;
  user_id: number;
  created_at: Date;
  updated_at: Date;
}

const POST_TABLE = "posts";

export class PostRepository {
  private db: Knex;

  public constructor(db: Knex) {
    this.db = db;
  }

  private queryBuilder() {
    return this.db.from<Post>(POST_TABLE);
  }

  public async getPostsByUser(user_id: number) {
    return this.queryBuilder().where("user_id", user_id);
  }

  public async getPostsByTag(tag: string) {
    return this.queryBuilder()
      .leftJoin("post_tag", "posts.id", "post_tag.post_id")
      .leftJoin("tags", "tags.id", "post_tag.tag_id")
      .where("tags.name", tag);
  }

  public async createPost(
    title: string,
    type: string,
    content: string,
    user_id: number
  ) {
    await this.queryBuilder().insert({
      title,
      type,
      content,
      user_id,
      updated_at: new Date(),
      created_at: new Date(),
    });
  }

  public async updatePost(id: number, update_bag: Partial<Post>) {
    await this.queryBuilder().insert({
      ...update_bag,
      id,
      updated_at: new Date(),
    });
  }

  public async removePost(id: number) {
    await this.queryBuilder().where("id", id).del();
  }
}
