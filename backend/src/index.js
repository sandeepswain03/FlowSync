import connectDB from "./db/index.js";
import logger from "./utils/logger.js";
import app from "./app.js";
import dotenv from "dotenv";
import chalk from "chalk";
import { initializeSocket } from "./socket.js";
import { createServer } from "http";
dotenv.config({ path: "./.env" });
const PORT = process.env.PORT || 5000;

const server = createServer(app);

connectDB()
    .then(() => {
        server.listen(PORT, () => {
            logger.info(
                chalk.green.bold.italic(
                    `Server started on port ${process.env.PORT}`
                )
            );
        });
        initializeSocket(server);
    })
    .catch((error) => {
        logger.error(chalk.red.bold.italic(error));
        process.exit(1);
    });
