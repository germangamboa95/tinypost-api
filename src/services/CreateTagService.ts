import { DataSource, Repository } from "typeorm";
import { Tag } from "../entity/Tag";

export class CreateTagService {
  private tag_repo: Repository<Tag>;

  constructor(data_source: DataSource) {
    this.tag_repo = data_source.getRepository(Tag);
  }

  public async upsertTag(tag_name: string) {
    const formatted_tag_name = tag_name.trim();

    const existing_tag = await this.tag_repo.findOne({
      where: {
        name: formatted_tag_name,
      },
    });

    if (existing_tag) {
      return existing_tag;
    }

    return this.tag_repo.save({
      name: formatted_tag_name,
    });
  }
}
