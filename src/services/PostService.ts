import { IPost, Post } from "../models/Post";
import { ITag, Tag } from "../models/Tag";
import { IUser } from "../models/User";

export class PostService {
  public static async create(user: IUser, post_dto: IPost, tags_dto: ITag[]) {
    const tags = await Promise.all(
      tags_dto.map(async (tag) => {
        await Tag.findByIdAndUpdate(null, { $set: tag }, { upsert: true });
      })
    );
    return await Post.create({
      ...post_dto,
      user,
      tags,
    });
  }

  public static async show(id: string) {
    return await Post.findById(id);
  }

  public static async edit(id: string, post_dto: IPost) {
    // TODO: Only creator can delete
    // TODO: Handle tag changes
    return await Post.findByIdAndUpdate(id, post_dto);
  }

  public static async list() {
    return await Post.find();
  }
}
