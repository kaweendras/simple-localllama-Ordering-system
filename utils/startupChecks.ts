import axios from "axios";
import { config } from "../config/environment";
import redisClient from "../config/redisClient";

// Function to check if Ollama API is running and the model is available
export async function checkOllamaAvailability() {
  if (config.MODE === "local") {
    console.log(`✅ MODE: ${config.MODE}`);
    try {
      // First check if Ollama API is running
      const apiUrl = config.OLLAMA.APIURL.split("/generate")[0]; // Get base URL
      const pingResponse = await axios.get(`${apiUrl}/version`);

      if (pingResponse.status === 200) {
        console.log(`✅ Ollama API is running (${pingResponse.data.version})`);

        // Check if the specified model is available
        const listModelsUrl = `${apiUrl}/tags`;
        const modelsResponse = await axios.get(listModelsUrl);

        if (modelsResponse.status === 200) {
          const availableModels = modelsResponse.data.models;
          const modelExists = availableModels.some(
            (model: { name: string }) => model.name === config.OLLAMA.MODEL_NAME
          );

          if (modelExists) {
            console.log(
              `✅ Ollama model "${config.OLLAMA.MODEL_NAME}" is available`
            );
          } else {
            console.warn(
              `⚠️ WARNING: Ollama model "${config.OLLAMA.MODEL_NAME}" is not available locally`
            );
            console.log(
              `Available models: ${availableModels
                .map((m: { name: string }) => m.name)
                .join(", ")}`
            );
          }
        }
      }
    } catch (error) {
      console.error("❌ Error: Ollama API is not running or not accessible");
      console.error(
        `Make sure Ollama server is running at ${config.OLLAMA.APIURL}`
      );
    }
  } else {
    console.log(`🌐 Running in ${config.MODE} mode, skipping Ollama check`);
  }
}

// Function to check if Redis server is running
export async function checkRedisAvailability() {
  try {
    // Check if Redis client is connected
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }

    // Ping Redis to verify it's responsive
    const pingResult = await redisClient.ping();
    if (pingResult === "PONG") {
      console.log(`✅ Redis server is running`);
      return true;
    } else {
      console.warn(
        `⚠️ WARNING: Redis server ping returned unexpected response: ${pingResult}`
      );
      return false;
    }
  } catch (error) {
    console.error("❌ Error: Redis server is not running or not accessible");
    console.error(
      `Make sure Redis server is running at ${config.REDIS_SERVER_URL}`
    );
    console.error(error);
    return false;
  }
}
