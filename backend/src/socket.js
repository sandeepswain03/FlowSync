import { Server } from "socket.io";
import { Project } from "./models/project.model.js";
import { generateResult } from "./utils/aiService.js";

let io;

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true,
            methods: ["GET", "POST", "PUT", "DELETE"],
            allowedHeaders: ["Content-Type", "Authorization"]
        }
    });

    io.use((socket, next) => {
        const projectId = socket.handshake.query.projectId;
        if (!projectId) {
            return next(new Error("No project ID provided"));
        }

        socket.project = Project.findById(projectId).then((project) => {
            if (!project) {
                return next(new Error("Project not found"));
            }
            next();
        });
    });

    io.on("connection", (socket) => {
        console.log(`🟢 Socket connected: ${socket.id}`);
        socket.roomId = socket.project._id;
        socket.join(socket.roomId);

        socket.on("project-message", async (data) => {
            const message = data.message;

            const aiIsPresentInMessage = message.includes("@ai");
            socket.broadcast.to(socket.roomId).emit("project-message", data);

            if (aiIsPresentInMessage) {
                const prompt = message.replace("@ai", "");

                const result = await generateResult(prompt);

                io.to(socket.roomId).emit("project-message", {
                    message: result,
                    sender: {
                        _id: "ai",
                        email: "AI"
                    }
                });

                return;
            }
        });

        socket.on("disconnect", () => {
            console.log(`🔴 Socket disconnected: ${socket.id}`);
            socket.leave(socket.roomId);
        });
    });
};

export { initializeSocket };
