import { model, Schema } from "mongoose";

export interface ITag {
  name: string;
}

const tag_schema = new Schema<ITag>(
  {
    name: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Tag = model("Tag", tag_schema);
