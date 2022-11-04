import { InferSchemaType, model, Schema } from "mongoose";

const tag_schema = new Schema(
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

export type ITag = InferSchemaType<typeof tag_schema>;

export const Tag = model<ITag>("Tag", tag_schema);
