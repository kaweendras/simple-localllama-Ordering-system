import dotenv from "dotenv";

dotenv.config();

export const config = {
  MODE: process.env.MODE || "local",
  PORT: process.env.PORT || 4000,
  REDIS_SERVER_URL: process.env.REDIS_SERVER_URL || "redis://127.0.0.1:6379",
  OLLAMA: {
    APIURL: process.env.OLLAMA_API_URL || "http://127.0.0.1:11434/api/generate",
    MODEL_NAME: process.env.OLLAMA_MODEL_NAME || "llama3.2:latest",
  },
  OPENAI: {
    APIKEY: process.env.OPENAI_API_KEY || "",
    APIURL:
      process.env.OPENAI_API_URL ||
      "https://api.openai.com/v1/chat/completions",
    MODEL_NAME: process.env.OPENAI_MODEL_NAME || "gpt-4o-2024-08-06",
  },
};
