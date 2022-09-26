import { data_source_test } from "../../db";
import { Tag } from "../../entity/Tag";
import { CreateTagService } from "../CreateTagService";

describe("TagService tests", () => {
  beforeEach(async () => {
    await data_source_test.initialize();
    await data_source_test.synchronize(true);
  });

  afterEach(async () => {
    await data_source_test.destroy();
  });

  it("it can create a tag", async () => {
    const service = new CreateTagService(data_source_test);

    const tag = await service.upsertTag("tag_random");

    expect(tag.name).toBe("tag_random");
  });

  it("it only creates one tag per same name", async () => {
    const service = new CreateTagService(data_source_test);

    await service.upsertTag("tag_random");
    await service.upsertTag("tag_random");
    await service.upsertTag("tag_random");
    await service.upsertTag("tag_random");

    const [_, count] = await data_source_test.getRepository(Tag).findAndCount({
      where: {
        name: "tag_random",
      },
    });

    expect(count).toBe(1);
  });
});
