import defaultSocket from "./src/default-socket";

document.addEventListener('DOMContentLoaded', function () {
  const sessionForm = document.getElementById('sessionForm');
  const sessionIdInput = document.getElementById('sessionId');
  const joinSessionBtn = document.getElementById('joinSession');
  const createSessionBtn = document.getElementById('createSession');
  const notification = document.getElementById('notification');
  const notificationText = document.getElementById('notificationText');

  // Check if user has a team saved in localStorage
  function hasTeam() {
    return localStorage.getItem('saved-team') !== null;
  }

  // Show notification function
  function showNotification(message, type = 'success') {
    notificationText.textContent = message;
    notification.className = `notification show ${type}`;

    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
  }

  // Join session handler
  joinSessionBtn.addEventListener('click', function () {
    const sessionId = sessionIdInput.value.trim();

    console.log({ sessionId });

    if (!sessionId) {
      showNotification('Please enter a session ID', 'error');
      return;
    }

    if (!hasTeam()) {
      showNotification('You need to create a team first. Redirecting to teambuilder...', 'warning');
      setTimeout(() => {
        window.location.href = '/teambuilder';
      }, 2000);
      return;
    } else {
      const uid = localStorage.getItem("pid");
      defaultSocket.emit("join", {
        roomId: sessionId,
        uuid: uid,
      });
    }
  });

  // Create session handler
  createSessionBtn.addEventListener('click', function () {
    if (!hasTeam()) {
      showNotification('You need to create a team first. Redirecting to teambuilder...', 'warning');
      setTimeout(() => {
        window.location.href = '/teambuilder';
      }, 2000);
      return;
    } else {
      defaultSocket.emit("create-session");
    }
  });

  defaultSocket.on("sid", (newSessionId) => {
    sessionIdInput.value = newSessionId;
    showNotification(`New session created: ${newSessionId}`);
  });

  defaultSocket.on("error", message => {
    showNotification(message, "error");
  });

  defaultSocket.on("join-session", (id) => {
    location.href = `game?id=${gameId}`;
  });

  // Prevent form submission (since we're handling clicks separately)
  sessionForm.addEventListener('submit', function (e) {
    e.preventDefault();
  });
});