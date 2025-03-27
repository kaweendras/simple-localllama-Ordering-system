import dotenv from "dotenv";

dotenv.config();

export const config = {
  ollama: {
    apiUrl: process.env.OLLAMA_API_URL || "http://127.0.0.1:11434/api/generate",
    modelName: process.env.MODELNAME || "llama2",
  },
  // Add other configuration settings here
};
