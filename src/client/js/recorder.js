import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg/dist/ffmpeg.min.js";

const actionBtn = document.getElementById("actionBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const files = {
  input: "recording.web,",
  output: "output.mp4",
  thumb: "thumbnail.jpg",
};

const downloadFile = (fileUrl, filename) => {
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
};

const handelDownload = async () => {
  actionBtn.removeEventListener("click", handelDownload);
  actionBtn.innerText = "Transcoding...";
  actionBtn.disabled = true;

  const ffmpeg = createFFmpeg({
    log: true,
    corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js",
  });
  await ffmpeg.load(); //소프트웨어를 실행하기 위해 await

  ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));

  await ffmpeg.run("-i", files.input, "-r", "60", files.output);

  await ffmpeg.run(
    "-i",
    files.input,
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    files.thumb
  ); //썸네일

  const mp4File = ffmpeg.FS("readFile", files.output);
  const thumbFile = ffmpeg.FS("readFile", files.thumb);

  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });

  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumbUrl = URL.createObjectURL(thumbBlob);

  downloadFile(mp4Url, "MyRecording.mp4");
  downloadFile(thumbUrl, "MyThumbnail.jpg");

  ffmpeg.FS("unlink", files.input);
  ffmpeg.FS("unlink", files.output);
  ffmpeg.FS("unlink", files.thumb);

  URL.revokeObjectURL(thumbUrl);
  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(videoFile);

  actionBtn.disabled = false;
  actionBtn.innerText = "Record Again";
  actionBtn.addEventListener("click", handleStart);
};

// const handleStop = () => {
//   actionBtn.innerHTML = "Download Recording";
//   actionBtn.removeEventListener("click", handleStop);
//   actionBtn.addEventListener("click", handelDownload);

//   recorder.stop();
// };

const handleStart = () => {
  //   actionBtn.innerHTML = "Stop Recording";
  actionBtn.innerHTML = "Recording";
  actionBtn.disabled = true;
  //   actionBtn.removeEventListener("click", handleStart);
  //   actionBtn.addEventListener("click", handleStop);

  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data);

    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();

    actionBtn.innerHTML = "Download";
    actionBtn.disabled = false;
    actionBtn.addEventListener("click", handelDownload);
  };

  recorder.start();
  setTimeout(() => {
    recorder.stop();
  }, 5000);
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    // video: true,
    video: { width: 1024, height: 576 },
  });
  video.srcObject = stream;
  video.play();
};

init();
actionBtn.addEventListener("click", handleStart);

// video.src : 정적인 비디오 파일 또는 URL
// video.srcObject : 동적인 미디어 stream (Live 등)
