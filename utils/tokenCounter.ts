import * as tiktoken from 'tiktoken';
import { encode } from 'gpt-tokenizer';
import { config } from '../config/environment';

/**
 * Token counting utility for different models
 */
export interface TokenCounterOptions {
  modelName?: string;
  type?: 'openai' | 'ollama';
}

/**
 * Count the number of tokens in a prompt
 * @param text - The text to count tokens for
 * @param options - Options including modelName and type
 * @returns The number of tokens in the text
 */
export function countTokens(text: string, options: TokenCounterOptions = {}): number {
  const modelType = options.type || getDefaultModelType();
  const modelName = options.modelName || getDefaultModelName(modelType);
  
  if (modelType === 'openai') {
    return countOpenAITokens(text, modelName);
  } else {
    return countOllamaTokens(text, modelName);
  }
}

/**
 * Count tokens using OpenAI's tiktoken
 */
function countOpenAITokens(text: string, modelName: string): number {
  try {
    // Get the encoding for the model
    const encoding = getEncodingForModel(modelName);
    
    // Encode the text and count tokens
    const tokens = encoding.encode(text);
    return tokens.length;
  } catch (error) {
    console.error(`❌ Error counting tokens for OpenAI model: ${error}`);
    // Fallback to approximation if tiktoken fails
    return approximateTokenCount(text);
  }
}

/**
 * Get the appropriate encoding based on the model
 */
function getEncodingForModel(modelName: string) {
  try {
    // cl100k is used for gpt-4, gpt-3.5-turbo, text-embedding-ada-002
    if (modelName.includes('gpt-4') || modelName.includes('gpt-3.5')) {
      return tiktoken.get_encoding('cl100k_base');
    } 
    // p50k_base is used for older models like davinci, curie, etc.
    else if (modelName.includes('text-davinci') || 
             modelName.includes('code-davinci')) {
      return tiktoken.get_encoding('p50k_base');
    } 
    // Default fallback
    else {
      return tiktoken.get_encoding('cl100k_base');
    }
  } catch (error) {
    console.error(`❌ Error loading encoding for ${modelName}: ${error}`);
    return tiktoken.get_encoding('cl100k_base');
  }
}

/**
 * Count tokens using GPT tokenizer for Ollama models
 */
function countOllamaTokens(text: string, modelName: string): number {
  try {
    // Use GPT tokenizer library for Ollama models
    const tokens = encode(text);
    return tokens.length;
  } catch (error) {
    console.error(`❌ Error counting tokens for Ollama model: ${error}`);
    // Fallback to approximation
    return approximateTokenCount(text);
  }
}

/**
 * Approximation for token count when tokenizers fail
 * This is a rough approximation (typically 1 token ≈ 4 characters for English text)
 */
function approximateTokenCount(text: string): number {
  // Simple approximation: ~4 characters per token for English
  return Math.ceil(text.length / 4);
}

/**
 * Get the default model type based on environment configuration
 */
function getDefaultModelType(): 'openai' | 'ollama' {
  return config.MODE === 'local' ? 'ollama' : 'openai';
}

/**
 * Get the default model name based on type
 */
function getDefaultModelName(type: 'openai' | 'ollama'): string {
  return type === 'openai' 
    ? config.OPENAI.MODEL_NAME 
    : config.OLLAMA.MODEL_NAME;
}