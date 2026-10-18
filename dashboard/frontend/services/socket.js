import { io } from "socket.io-client";

// Connect to the same origin (frontend dev server) which proxies WebSocket to the backend.
// This works for both laptop and phone clients on the local network.
export const socket = io();

socket.on("connect", () => {
  console.log("Connected to SiteSentry WebSocket Server");
});

socket.on("disconnect", () => {
  console.warn("Disconnected from SiteSentry WebSocket Server");
});
