export const removeThinkingContent = (text: string): string => {
  // Remove any content within <think> tags
  const withoutThinking = text.replace(/<think>[\s\S]*?<\/think>/g, '');
  // Also clean any JSON formatting
  return cleanJsonResponse(withoutThinking);
};

export const cleanJsonResponse = (text: string): string => {
  // Remove ```json at the beginning and ``` anywhere in the text (not just at the end)
  let cleaned = text.replace(/^```json\s*/i, '');
  cleaned = cleaned.replace(/```\s*$/m, ''); // Handle backticks at the end with possible whitespace
  cleaned = cleaned.replace(/```.*$/m, ''); // Handle backticks with trailing content
  return cleaned.trim();
};

