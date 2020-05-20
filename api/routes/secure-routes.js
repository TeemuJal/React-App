const express = require('express');

const mongoose = require("mongoose");
const Post = require('../model/Post.model');

const router = express.Router();

router.get('/user/authenticate', (req, res, next) => {
  res.json({
    message : 'Authenticated!',
    user : req.user
  })
});

router.post('/user/makePost', async (req, res, next) => {
  const message = req.body.message;
  const user = req.user._id;
  const date = new Date();
  console.log("Message: " + message + " ID: " + user);

  try {
    const post = await Post.create({ message, postedBy: user, datePosted: date });
    console.log("Post created")
    res.json("Post created!");
  }
  catch (error) {
    res.status(500).json("Something went wrong.");
  }
});

router.get('/posts', async (req, res, next) => {
  console.log("Get posts");
  try {
    const postArray = await Post.find({}).populate("postedBy" ,"username");
    console.log("Posts fetched")
    res.json(JSON.stringify(postArray));
  }
  catch (error) {
    res.status(500).json("Something went wrong.");
  }
});

router.delete('/posts/:postId', async (req, res, next) => {
  console.log("Deleting post...");
  const postId = req.params.postId;
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    console.log("Invalid post id.");
    res.status(400).json("Invalid post id.");
    return;
  }
  const user = req.user._id;
  try {
    const postToBeDeleted = await Post.findById(postId);
    if (!postToBeDeleted) {
      console.log("Post not found.");
      res.status(404).json("Post not found.");
      return;
    }
    console.log("Requester's id: " + user + ", Post's id: " + postToBeDeleted.postedBy);
    if (postToBeDeleted.postedBy == user) {
      console.log("Post is posted by the requester");
      await postToBeDeleted.remove();
      console.log("Post deleted!");
      res.json("Post deleted!");
    }
    else {
      console.log("Not posted by the requester.");
      res.status(401).json("Unauthorized.");
    }
  }
  catch (error) {
    console.log(error);
    res.status(500).json("Something went wrong.");
  }
});

module.exports = router;
