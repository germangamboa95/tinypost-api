import { API_CONTROLLERS } from "..";
import { app } from "../../web";
import request from "supertest";

import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

app.use("/api", API_CONTROLLERS);

let connection: typeof mongoose;

describe("ApiController test suite", () => {
  beforeAll(async () => {
    connection = await mongoose.connect("mongodb://localhost:27017", {
      auth: {
        username: "root",
        password: "example",
      },
      dbName: "tinypost_test",
    });

    await connection.connection.db.dropDatabase();
  });

  afterAll(async () => {
    await connection.connection.close();
  });

  describe("User Registeration", () => {
    it("can register user, validation fails ", async () => {
      const response = await request(app).post("/api/register").send({});

      expect(response.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
    });

    it("can register user, validation fails with password mismatch ", async () => {
      const response = await request(app).post("/api/register").send({
        username: "user_1",
        password: "12345678",
        password_confirm: "no",
      });

      expect(response.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
    });

    it("can register user, validation passes ", async () => {
      const response = await request(app).post("/api/register").send({
        username: "user_1",
        password: "12345678",
        password_confirm: "12345678",
      });

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.token).toBeTruthy();
      expect(response.body.user).toMatchObject({
        username: "user_1",
      });
    });

    it("prevents duplicate users ", async () => {
      const response = await request(app).post("/api/register").send({
        username: "user_1",
        password: "12345678",
        password_confirm: "12345678",
      });

      expect(response.status).toBe(StatusCodes.CONFLICT);
      expect(response.body).toMatchObject({
        message: "Username is taken",
      });
    });
  });

  describe("User Login", () => {
    it("can log in with correct password", async () => {
      const response = await request(app).post("/api/login").send({
        username: "user_1",
        password: "12345678",
      });

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.token).toBeTruthy();
      expect(response.body.user).toMatchObject({
        username: "user_1",
      });
    });

    it("handles wrong password correctly", async () => {
      const response = await request(app).post("/api/login").send({
        username: "user_1",
        password: "no",
      });

      expect(response.status).toBe(StatusCodes.FORBIDDEN);
      expect(response.body).toMatchObject({
        message: "Invalid Credentials",
      });
    });

    it("token works to get self ", async () => {
      const response_login = await request(app).post("/api/login").send({
        username: "user_1",
        password: "12345678",
      });

      const response_self = await request(app)
        .get("/api/self")
        .auth(response_login.body.token, { type: "bearer" });

      expect(response_self.status).toBe(StatusCodes.OK);
      expect(response_login.body.user).toMatchObject({
        username: "user_1",
      });
    });
  });

  describe("Post Creation ", () => {
    it("post route has authentication", async () => {
      const response = await request(app)
        .post("/api/posts")
        .send({
          title: "This is a post",
          content_type: "text",
          content_body: "this is the content of the post",
          tags: ["first_post", "text_post", "cookies"],
        });

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it("post route has validation", async () => {
      const auth_reponse = await request(app).post("/api/login").send({
        username: "user_1",
        password: "12345678",
      });

      const response = await request(app)
        .post("/api/posts")
        .send()
        .auth(auth_reponse.body.token, {
          type: "bearer",
        });

      expect(response.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
    });

    it("allows user to create a basic post ", async () => {
      const auth_reponse = await request(app).post("/api/login").send({
        username: "user_1",
        password: "12345678",
      });

      const response = await request(app)
        .post("/api/posts")
        .send({
          title: "This is a post",
          content_type: "text",
          content_body: "this is the content of the post",
          tags: ["first_post", "text_post", "cookies"],
        })
        .auth(auth_reponse.body.token, {
          type: "bearer",
        });

      expect(response.status).toBe(StatusCodes.OK);
    });

    it("allows only the creator to update post ", async () => {
      const f_auth_response = await request(app).post("/api/register").send({
        username: "user_2",
        password: "12345678",
        password_confirm: "12345678",
      });

      const auth_reponse = await request(app).post("/api/login").send({
        username: "user_1",
        password: "12345678",
      });

      const response_create = await request(app)
        .post("/api/posts")
        .send({
          title: "This is a post",
          content_type: "text",
          content_body: "this is the content of the post",
          tags: ["first_post", "text_post", "cookies"],
        })
        .auth(auth_reponse.body.token, {
          type: "bearer",
        });

      const response_edit = await request(app)
        .patch(`/api/posts/${response_create.body.post._id}`)
        .send({
          title: "The post was updated",
          tags: ["post"],
        })
        .auth(auth_reponse.body.token, {
          type: "bearer",
        });

      const response_edit_fail = await request(app)
        .patch(`/api/posts/${response_create.body.post._id}`)
        .send({
          title: "This is a post",
        })
        .auth(f_auth_response.body.token, {
          type: "bearer",
        });

      console.log(response_edit.body);

      expect(response_edit.status).toBe(StatusCodes.OK);
      expect(response_edit_fail.status).toBe(StatusCodes.FORBIDDEN);
    });
  });

  describe("Fetch Posts", () => {
    it("can fetch posts no filters", async () => {
      const response = await request(app).get("/api/posts");

      expect(response.status).toBe(StatusCodes.OK);
      expect(Array.isArray(response.body.posts)).toBe(true);
    });
  });
});
