import mongoose from "mongoose";
import Repost from "./reposts.js";

const postSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
}, { timestamps: true });

postSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

postSchema.pre(/^find/, function (next) {
  this.populate("author", "username profilePicture")
      .populate("comments");
  next();
});

postSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Repost.deleteMany({ post: doc._id });
  }
});

const Post = mongoose.model("Post", postSchema);
export default Post;