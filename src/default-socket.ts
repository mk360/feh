import { io } from "socket.io-client";

const socket = io("http://localhost:3600");

socket.auth = {
    id: localStorage.getItem("id")
};

export default socket;