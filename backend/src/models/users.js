import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String, default: "" },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  profilePicture: { type: String, default: "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png" },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;