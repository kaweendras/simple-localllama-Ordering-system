import { OpenAI } from "openai";
import { config } from "../../config/environment";

const apiKey = config.OPENAI.APIKEY;
const modelName = config.OPENAI.MODEL_NAME;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey,
});

export const generateResponse = async (prompt: string): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: modelName,
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("❌ Error calling OpenAI API:", error);
    throw new Error(`Failed to generate response from OpenAI: ${error}`);
  }
};