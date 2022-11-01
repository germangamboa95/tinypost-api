import { model, Schema, Types } from "mongoose";

interface IComment {
  content: string;
  user?: Types.ObjectId;
  comments?: Schema.Types.ObjectId;
}

const comment_schema = new Schema<IComment>({
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

export const Comment = model("Comment", comment_schema);
