import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const OLLAMA_URL = "http://127.0.0.1:11434/api/generate";
const MODEL_NAME = process.env.MODELNAME;

export let tempOrder: any; // Temporary storage for order before confirmation

export async function extractOrderDetails(userMessage: string) {
  console.log("🔍 Extracting order details from:", userMessage);
  try {
    const response = await axios.post(OLLAMA_URL, {
      model: MODEL_NAME,
      prompt: `Extract structured order details in JSON format(no codes or explenation or anything else needed. just the result/output):
            Example input: "I want a large cheese pizza with extra pepperoni and a large diet coke."
            Example output: 
            {
            reply: "Got it!, You ordered a large cheese pizza with pepperoni and a large diet coke. Please confirm (yes/no).",
            orderDetails:{
                "items": ["cheese pizza"],
                "size": ["large"],
                "extras": ["pepperoni"],
                "drink":[ "large diet coke"]
                 }
            }
            Now extract the order from: "${userMessage}"`,
      stream: false,
    });

    console.log("🔍 Ollama Response:", response.data.response);
    const parsedResponse = JSON.parse(response.data.response);
    tempOrder = parsedResponse;

    return parsedResponse;
  } catch (error) {
    console.error("❌ Ollama API Error:", error);
    return null;
  }
}
