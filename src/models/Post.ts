import { Schema, model, Types } from "mongoose";

export interface IPost {
  title: string;
  content_url: string;
  content_type: "link" | "image" | "text";
  content_body: string;
  user?: Types.ObjectId;
  comments?: Types.ObjectId;
  tags?: [Types.ObjectId];
}

const user_schema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
    },
    content_url: {
      type: String,
    },
    content_type: {
      type: Schema.Types.String,
      default: "text",
    },
    content_body: {
      type: Schema.Types.String,
      default: "",
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
        required: true,
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Post = model("Post", user_schema);
