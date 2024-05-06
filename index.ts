import socket from "./src/default-socket";

socket.on("response create session", ({ roomName, playerId }) => {

});

document.getElementById("session-creator")!.onformdata = function (e) {
    e.preventDefault();
    const id = e.formData.get("id");
    if (id) {

    } else {
        socket.emit("request create session");
    }
}