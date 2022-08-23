import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (t) => {
    t.bigIncrements("id");
    t.string("username");
    t.string("email").nullable();
    t.timestamps();
  });

  await knex.schema.createTable("user_authentication", (t) => {
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
    t.string("content");
    t.timestamps();
  });

    await knex.schema.createTable("tags", (t) => {
      t.bigIncrements("id");
      t.string("title");
      t.string("type");
      t.string("content");
      t.timestamps();
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("users");
  await knex.schema.dropTable("posts");
  await knex.schema.dropTable("user_authentication");
}
