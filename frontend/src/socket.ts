import { io } from 'socket.io-client';

//const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3000';

const URL = 'http://localhost:3000';

const socket = io(URL);

export default socket;
