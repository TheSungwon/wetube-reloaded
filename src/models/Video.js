import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxLength: 80 },
  description: { type: String, required: true, trim: true, minLength: 20 },
  createdAt: { type: Date, required: true, default: Date.now }, //Date.now()가 아닌 Date.now()는 함수가 바로 실행되므로, now까지만 적으면 mongoose가 알아서 변환
  hashtags: [{ type: String, trim: true }], // String이나 {type:String} 같은 표현, String은 축약
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
});

const Video = mongoose.model("Video", videoSchema);
export default Video;
