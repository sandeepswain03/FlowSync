import socket from 'socket.io-client';

let socketInstance: any = null;

const initializeSocket = (projectId: string): any => {
    socketInstance = socket("http://localhost:3000", {
        withCredentials: true,
        query: {
            projectId: projectId
        }
    });
    return socketInstance;
}

const receiveMessage = (eventName: string, cb: (data: any) => void): void => {
    socketInstance.on(eventName, cb);
}

const sendMessage = (eventName: string, data: any): void => {
    socketInstance.emit(eventName, data);
}

export { initializeSocket, receiveMessage, sendMessage };