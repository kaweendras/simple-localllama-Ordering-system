import {
  orderPromptTemplate,
  matchUserInputTemplate,
} from "../prompts/orderPrompts";
import { generateResponse } from "./ollamaClient";
import { OrderResponse, UserConfirmation } from "../types/order";
import dotenv from "dotenv";

dotenv.config();

export let tempOrder: OrderResponse | null = null; // Temporary storage with proper typing

export async function extractOrderDetails(
  userMessage: string
): Promise<OrderResponse | null> {
  console.log("🔍 Extracting order details from:", userMessage);

  try {
    // Generate the prompt using LangChain
    const prompt = await orderPromptTemplate.format({ userMessage });

    // Get response from Ollama client
    const responseText = await generateResponse(prompt);
    console.log("🔍 Ollama Response:", responseText);

    const parsedResponse = JSON.parse(responseText) as OrderResponse;
    tempOrder = parsedResponse;

    return parsedResponse;
  } catch (error) {
    console.error("❌ Order extraction error:", error);
    return null;
  }
}

export const matchUserInput = async (
  userMessage: string
): Promise<UserConfirmation | null> => {
  console.log("🔍 Matching user input:", userMessage);

  try {
    // Generate the prompt using LangChain
    const prompt = await matchUserInputTemplate.format({ userMessage });

    // Get response from Ollama client
    const responseText = await generateResponse(prompt);
    console.log("🔍 User confirmation response:", responseText);

    return JSON.parse(responseText) as UserConfirmation;
  } catch (error) {
    console.error("❌ User input matching error:", error);
    return null;
  }
};
