import {
  orderPromptTemplate,
  matchUserInputTemplate,
  suggetionPromptTemplate,
} from "../../prompts/orderPrompts";
import { generateResponse } from "./ollamaClient";
import { OrderResponse, UserConfirmation } from "../../types/order";
import dotenv from "dotenv";
import { getTempOrder, setTempOrder } from "../../utils/tempOrder";
import { countTokens } from "../../utils/tokenCounter";
import logger from "../../utils/logger";
import { removeThinkingContent } from "../../utils/reasoningModelUtils";

dotenv.config();

export async function extractOrderDetails(
  userId: string,
  userMessage: string
): Promise<OrderResponse | null> {
  console.log("🔍 Extracting order details from:", userMessage);

  try {
    // Generate the prompt using LangChain
    const prompt = await orderPromptTemplate.format({ userMessage });

    // Count tokens in the prompt
    const promptTokens = countTokens(prompt, { type: "ollama" });
    logger.info(`📊 Order extraction prompt tokens: ${promptTokens}`);

    // Get response from Ollama client
    let responseText = await generateResponse(prompt);

    // Remove any thinking content
    responseText = removeThinkingContent(responseText);

    // Count tokens in the response
    const responseTokens = countTokens(responseText, { type: "ollama" });
    logger.info(`📊 Order extraction response tokens: ${responseTokens}`);
    logger.info(`📊 Total tokens used: ${promptTokens + responseTokens}`);

    console.log("🔍 Ollama Response:", responseText);

    const parsedResponse = JSON.parse(responseText) as OrderResponse;
    setTempOrder(userId, parsedResponse);

    return parsedResponse;
  } catch (error) {
    console.error("❌ Order extraction error:", error);
    return null;
  }
}

export async function suggestItems(
  userId: string,
  pastOrders: string
): Promise<OrderResponse | null> {
  // console.log("🔍 Suggesting items based on past orders:", pastOrders);
  try {
    // Generate the prompt using LangChain
    const prompt = await suggetionPromptTemplate.format({ pastOrders });

    // Count tokens in the prompt
    const promptTokens = countTokens(prompt, { type: "ollama" });
    logger.info(`📊 Suggestion prompt tokens: ${promptTokens}`);

    // Get response from Ollama client
    let responseText = await generateResponse(prompt);

    // Remove any thinking content
    responseText = removeThinkingContent(responseText);

    // Count tokens in the response
    const responseTokens = countTokens(responseText, { type: "ollama" });
    logger.info(`📊 Suggestion response tokens: ${responseTokens}`);
    logger.info(`📊 Total tokens used: ${promptTokens + responseTokens}`);

    console.log("🔍 Suggestion Response:", responseText);

    const parsedResponse = JSON.parse(responseText) as OrderResponse;
    setTempOrder(userId, parsedResponse);

    return parsedResponse;
  } catch (error) {
    console.error("❌ Item suggestion error:", error);
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

    // Count tokens in the prompt
    const promptTokens = countTokens(prompt, { type: "ollama" });
    logger.info(`📊 User input matching prompt tokens: ${promptTokens}`);

    // Get response from Ollama client
    let responseText = await generateResponse(prompt);

    // Remove any thinking content
    responseText = removeThinkingContent(responseText);

    // Count tokens in the response
    const responseTokens = countTokens(responseText, { type: "ollama" });
    logger.info(`📊 User input matching response tokens: ${responseTokens}`);
    logger.info(`📊 Total tokens used: ${promptTokens + responseTokens}`);

    console.log("🔍 User confirmation response:", responseText);

    return JSON.parse(responseText) as UserConfirmation;
  } catch (error) {
    console.error("❌ User input matching error:", error);
    return null;
  }
};
