import { InferSchemaType, model, Schema } from "mongoose";

const comment_schema = new Schema({
  content: {
    type: Schema.Types.String,
    required: true,
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
});

export type IComment = InferSchemaType<typeof comment_schema>;

export const Comment = model<IComment>("Comment", comment_schema);
