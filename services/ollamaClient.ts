import axios from "axios";
import { config } from "../config/environment";

interface OllamaRequest {
  model: string;
  prompt: string;
  stream: boolean;
}

const apiUrl = config.ollama.apiUrl;
const modelName = config.ollama.modelName;

export const generateResponse = async (prompt: string): Promise<string> => {
  try {
    const request: OllamaRequest = {
      model: modelName,
      prompt,
      stream: false,
    };

    const response = await axios.post(apiUrl, request);
    return response.data.response;
  } catch (error) {
    console.error("❌ Error calling Ollama API:", error);
    throw new Error(`Failed to generate response from Ollama: ${error}`);
  }
};
