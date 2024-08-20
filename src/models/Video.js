import mongoose from "mongoose";

export const formatHashtags = (hashtags) => {
  return hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
};

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxLength: 80 },
  fileUrl: { type: String, required: true },
  description: { type: String, required: true, trim: true, minLength: 10 },
  createdAt: { type: Date, required: true, default: Date.now }, //Date.now()가 아닌 Date.now()는 함수가 바로 실행되므로, now까지만 적으면 mongoose가 알아서 변환
  hashtags: [{ type: String, trim: true }], // String이나 {type:String} 같은 표현, String은 축약
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  //User schema의 ID를 입력
});

//middleware
videoSchema.pre("save", async function () {
  // console.log(`we are about to save : ${this}`);
  //this.title = "~~~"; title이 middleware에 의해 save 전에 변경됨
  // this.hashtags = this.hashtags[0]
  //   .split(",")
  //   .map((word) => (word.startsWith("#") ? word : `#${word}`));
});
//save에는 가능하지만 update는 불가.

videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});
//Video.formatHashtags(hashtag) 으로 사용.

const Video = mongoose.model("Video", videoSchema);
export default Video;
