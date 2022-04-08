import socketio from "socket.io-client"
import { createContext } from 'react'; 

export const socket = socketio.connect('http://localhost:3000');
export const SocketContext = createContext(socket); 