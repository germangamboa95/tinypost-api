import { Router } from "express";

import { HOME_PAGE } from "../constants";
import { PostService } from "../services/PostService";

export const HomeController = Router();

HomeController.get("/", async (req, res) => {
  const posts = await PostService.list();

  console.log(posts);
  return res.render(HOME_PAGE, {
    posts,
  });
});
