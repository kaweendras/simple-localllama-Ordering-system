import axios from "axios";
import { config } from "../config/environment";

interface OllamaRequest {
  model: string;
  prompt: string;
  stream: boolean;
}

export class OllamaClient {
  private apiUrl: string;
  private modelName: string;

  constructor() {
    this.apiUrl = config.ollama.apiUrl;
    this.modelName = config.ollama.modelName;
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      const request: OllamaRequest = {
        model: this.modelName,
        prompt,
        stream: false,
      };

      const response = await axios.post(this.apiUrl, request);
      return response.data.response;
    } catch (error) {
      console.error("❌ Error calling Ollama API:", error);
      throw new Error(`Failed to generate response from Ollama: ${error}`);
    }
  }
}
