import { HydratedDocument } from "mongoose";
import { ResourceNotAuth } from "../errors/ResourceNotAuth";
import { IPost, Post } from "../models/Post";
import { Tag } from "../models/Tag";
import { IUser } from "../models/User";

export class PostService {
  public static async create(user: IUser, post_dto: IPost, tags_dto: string[]) {
    const existing_tags = await Tag.find({
      name: {
        $in: tags_dto,
      },
    });

    const missing_tags = tags_dto.filter(
      (x) => !existing_tags.map((t) => t.name).includes(x)
    );

    const created_tags = await Tag.insertMany(
      missing_tags.map((t) => {
        return {
          name: t,
        };
      })
    );

    return await Post.create({
      ...post_dto,
      user,
      tags: [...existing_tags, ...created_tags],
    });
  }

  public static async show(id: string) {
    return await Post.findById(id);
  }

  public static async edit(
    id: string,
    post_dto: IPost,
    user: HydratedDocument<IUser>
  ) {
    const existing_post = await Post.findById(id).populate("user");

    if (!existing_post?.user?._id.equals(user._id)) {
      throw new ResourceNotAuth();
    }

    // @ts-ignore
    const tags_dto = post_dto.tags as string[];

    const existing_tags = await Tag.find({
      name: {
        $in: tags_dto,
      },
    });

    const missing_tags = tags_dto.filter(
      (x) => !existing_tags.map((t) => t.name).includes(x)
    );

    const created_tags = await Tag.insertMany(
      missing_tags.map((t) => {
        return {
          name: t,
        };
      })
    );

    await existing_post.update({
      ...post_dto,
      tags: [...existing_tags, ...created_tags],
    });

    return await Post.findById(id).populate("user").populate("tags");
  }

  public static async list() {
    return await Post.find();
  }
}
