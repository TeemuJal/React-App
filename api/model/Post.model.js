const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const PostSchema = new Schema({
    message: {
        type: String,
        required: true
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User'
    },
    datePosted: {
      type: Date
    }
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
