const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const socket = io();


// message from server
socket.on("message", message => {
  console.log(message);
  outputMessage(message);

  // scroll down
   chatMessages.scrollTop = chatMessages.scrollHeight;

})

// message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // get message text
  const msg = e.target.elements.msg.value;
  console.log(msg);
  
  // emit message to server
  socket.emit("chatMessage", msg);
});

// output message to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">Brad <span>9:12pm</span></p>
  <p class="text">
    ${message}
  </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}