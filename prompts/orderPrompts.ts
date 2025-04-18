import { PromptTemplate } from "@langchain/core/prompts";

// Prompt for extracting order details
export const orderPromptTemplate = new PromptTemplate({
  inputVariables: ["userMessage"],
  template: `
    Extract structured order details in JSON format (no codes or explanation or anything else needed, just the result/output):
    
    Example input: "I want a large cheese pizza with extra pepperoni and a large diet coke."
    
    Example output: 
    {{
      "reply": "Got it! You ordered a large cheese pizza with pepperoni and a large diet coke. Please confirm (yes/no).",
      "orderDetails": {{
        "items": ["cheese pizza"],
        "size": ["large"],
        "extras": ["pepperoni"],
        "drink": ["large diet coke"]
      }},
      "type": "Place Order"
    }}
    
    Now extract the order from: "{userMessage}"
  `,
});

// Prompt for user confirmation matching
export const matchUserInputTemplate = new PromptTemplate({
  inputVariables: ["userMessage"],
  template: `
    Check if the user input is positive or negative:
    
    Example Positive input: "Yes Go Ahead", "Yes", "confirm", "I want to confirm", "sounds good", "positive". 
    No codes or scripts needed. Just the result/output.
    
    Example output: 
    {{
      "userResponse": "yes"
    }}
    
    Example Negative input: "No", "I don't want to confirm", "I don't want to order", "negative", "scratch that", "cancel".
    Example output: 
    {{
      "userResponse": "no"
    }}
    
    Now check the user input from: "{userMessage}"
  `,
});


export const suggetionPromptTemplate = new PromptTemplate({
  inputVariables: ["pastOrders"],
  template: `
    Suggest a few items based on the user input:  
    Example input:"and array of past orders"
    Example output:
    {{
      "reply": "Based on your past orders, here are some suggestions. Would you like to confirm this order?",
      "orderDetails": }}
        "items": ["cheese pizza"],
        "size": ["large"],
        "extras": ["extra cheese"],
        "drink": ["diet coke"]
      }},
      "type": "Suggestion"
}}

    Now suggest items based on past orders of: "{pastOrders}"
    one from each orderDetails cagtegory.
    need output only no codes or explanation or anything else needed, just the result/output:
  `,
});