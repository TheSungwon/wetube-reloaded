import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  avatarUrl: { type: String, default: "" },
  socialOnly: { type: Boolean, default: false },
  username: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String, required: true },
  location: { type: String },
  comments: [
    { type: mongoose.Schema.ObjectId, required: true, ref: "Comment" },
  ],
  videos: [
    { type: mongoose.Schema.Types.ObjectId, required: false, ref: "Video" },
  ],
});

//postUpload 할 때 user.save()를 함, 그렇게 되면 hash를 또 실행하게 됨
//hash를 방지하기 위해 this.isModified를 사용해서 password가 변경됨을 감지
UserSchema.pre("save", async function () {
  if (this.isModified("password")) {
    console.log("password:", this.password);
    this.password = await bcrypt.hash(this.password, 5);
    console.log("password encrypt: ", this.password);
  }
});
const User = mongoose.model("User", UserSchema);

export default User;
