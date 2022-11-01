import { Schema, model, Types } from "mongoose";

interface IPost {
  title: string;
  content_url: string;
  content_type: "link" | "image";
  user?: Types.ObjectId;
  comments?: Types.ObjectId;
}

const user_schema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
    },
    content_url: {
      type: String,
      required: true,
    },
    content_type: {
      type: Schema.Types.String,
      default: "link",
    },
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
