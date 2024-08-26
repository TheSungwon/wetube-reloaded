const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.className = "video__comment";
  newComment.dataset.id = id;

  const icon = document.createElement("i");
  icon.className = "fas fa-comment";

  const span = document.createElement("span");
  span.innerText = `  ${text}`;

  const delSpan = document.createElement("span");
  delSpan.id = "delComment";
  delSpan.innerText = "💥";

  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(delSpan);

  videoComments.prepend(newComment);
  //   videoComments.appendChild(newComment);

  const li = document.getElementsByClassName("video__comment");
  for (let i = 0; i < li.length; i++) {
    const secondSpan = li[i].getElementsByTagName("span")[1];
    secondSpan.addEventListener("click", handleDelComment);
  }
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  console.log(JSON.stringify({ text }));

  if (text.trim() === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (response.status === 201) {
    const { newCommentId } = await response.json();
    textarea.value = "";
    //let을 선언된 text = ""; 를 하면 textarea.value는 비워지지 않음
    //text는 textarea.value를 복사한 변수이기 때문
    addComment(text, newCommentId);
  }
};

const handleDelComment = async (event) => {
  if (confirm("Delete your comment?")) {
    const { id } = event.target.parentElement.dataset;
    const videoId = videoContainer.dataset.id;
    const response = await fetch(`/api/deleteComment/${videoId}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    event.target.parentElement.remove();
    console.log(response);
  }
};
if (form) {
  form.addEventListener("submit", handleSubmit);

  const li = document.getElementsByClassName("video__comment");
  for (let i = 0; i < li.length; i++) {
    const secondSpan = li[i].getElementsByTagName("span")[1];
    secondSpan.addEventListener("click", handleDelComment);
  }
}
