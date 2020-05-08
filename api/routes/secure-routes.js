const express = require('express');

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
    const postArray = await Post.find({}).populate("postedBy");
    console.log("Posts fetched")
    res.json(JSON.stringify(postArray));
  }
  catch (error) {
    res.status(500).json("Something went wrong.");
  }
});

module.exports = router;
