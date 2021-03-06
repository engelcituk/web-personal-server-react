const express = require("express");
const PostController = require("../controllers/post"); //controller post
//midleware para controlar las peticiones por tokens
const mdAuth = require("../middlewares/authenticated");

const api = express.Router();

api.post("/post", [mdAuth.ensureAuth], PostController.addPost); //add new post
api.get("/post", PostController.getPosts); //get posts
api.get("/post/:url", PostController.getPost); //get a one post by url
api.put("/post/:id", [mdAuth.ensureAuth], PostController.updatePost); //update post
api.delete("/post/:id", [mdAuth.ensureAuth], PostController.deletePost); //update post


module.exports = api;