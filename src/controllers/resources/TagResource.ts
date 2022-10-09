import { Tag } from "../../entity/Tag";

export class TagResource {
  public static toCollection(tag: Tag[]) {
    return tag.map(this.toResource);
  }
  public static toResource(tag: Tag) {
    return {
      id: tag.id,
      name: tag.name,
    };
  }
}
