import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (t) => {
    t.bigIncrements("id");
    t.string("email").nullable();
    t.timestamp("last_seen_at").nullable();
    t.timestamps();
  });

  await knex.schema.createTable("magic_link", (t) => {
    t.bigInteger("user_id").references("id").inTable("users");
    t.string("password").nullable();
    t.string("type");
    t.string("external_id").nullable();
    t.timestamps();
  });

  await knex.schema.createTable("posts", (t) => {
    t.bigIncrements("id");
    t.string("title");
    t.string("type");
    t.text("content");
    t.bigInteger("user_id").references("id").inTable("users");
    t.timestamps();
  });

  await knex.schema.createTable("tags", (t) => {
    t.bigIncrements("id");
    t.string("name").unique();
    t.timestamps();
  });

  await knex.schema.createTable("post_tag", (t) => {
    t.bigIncrements("id");
    t.bigInteger("post_id").references("id").inTable("posts");
    t.bigInteger("tag_id").references("id").inTable("tags");
    t.timestamps();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("users");
  await knex.schema.dropTable("posts");
  await knex.schema.dropTable("user_authentication");
}
