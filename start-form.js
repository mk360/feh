import defaultSocket from "./src/default-socket";

defaultSocket.on("join-session", (gameId) => {
    location.href = `game?id=${gameId}`;
});

defaultSocket.on("error", msg => {
    document.getElementById("error-message").innerText = msg;
});

defaultSocket.on("confirm", msg => {
    document.getElementById("confirm").innerHTML = msg;
});

document.getElementById("join-session").onclick = function () {
    const gameId = document.getElementById("game-id").value;
    const uid = localStorage.getItem("pid");
    defaultSocket.emit("join", {
        roomId: gameId,
        uuid: uid,
    });
};

document.getElementById("create-session").onclick = function() {
    defaultSocket.emit("create-session", {
        uuid: localStorage.getItem("pid"),
    });
}
