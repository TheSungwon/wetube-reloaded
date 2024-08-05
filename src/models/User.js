import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  avatarUrl: String,
  socialOnly: { type: Boolean, default: false },
  username: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String, required: true },
  location: { type: String },
});

UserSchema.pre("save", async function () {
  console.log("password:", this.password);
  this.password = await bcrypt.hash(this.password, 5);
  console.log("password encrypt: ", this.password);
});
const User = mongoose.model("User", UserSchema);

export default User;
