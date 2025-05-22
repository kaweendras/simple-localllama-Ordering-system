import { createClient } from "redis";
import { config } from "./environment";

const redisClient = createClient({
  url: config.REDIS_SERVER_URL,
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

(async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
})();

export default redisClient;
