import Redis from "ioredis";
import logger from "./logger.js";
import dotenv from "dotenv";
import chalk from "chalk";
dotenv.config({ path: "./.env" });

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
});

redis.on("connect", () => {
    logger.info(
        chalk.green.bold.italic(
            `Redis started on port ${process.env.REDIS_PORT}`
        )
    );
});
redis.on("error", (err) => {
    logger.error(chalk.red.bold.italic(err));
    process.exit(1);
});

export default redis;
