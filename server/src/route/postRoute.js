


import express from "express";
import {
    CreatePost,
    GetAllPosts,
    GetPostById,
    UpdatePost,
    DeletePost,
} from "../controller/postController.js";
import { IsLoggedIn } from "../middleware/authMiddleware.js";

const postRoute = express.Router();

postRoute.post("/post/create-post", IsLoggedIn, CreatePost);
postRoute.get("/post/all-post", GetAllPosts);
postRoute.get("/post/:id", IsLoggedIn, GetPostById);
postRoute.patch("/post/:id", IsLoggedIn, UpdatePost);
postRoute.delete("/post/:id", IsLoggedIn, DeletePost);

export default postRoute;