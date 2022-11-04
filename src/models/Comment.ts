import { model, Schema, Types } from "mongoose";
import { IUser } from "./User";

export interface IComment {
  content: string;
  user?: IUser;
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
