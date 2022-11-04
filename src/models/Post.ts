import { Schema, model, InferSchemaType } from "mongoose";

const user_schema = new Schema(
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

export type IPost = InferSchemaType<typeof user_schema>;

export const Post = model<IPost>("Post", user_schema);
