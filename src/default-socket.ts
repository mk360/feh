import { io } from "socket.io-client";

const socket = io("http://localhost:3600");

export default socket;