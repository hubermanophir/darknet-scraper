const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
  author: String,
  title: String,
  date: Date,
  content: String,
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
