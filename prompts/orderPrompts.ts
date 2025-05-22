import { PromptTemplate } from "@langchain/core/prompts";
import * as fs from 'fs';
import * as path from 'path';

// Import templates from JSON file
const templatesPath = path.join(__dirname, '..', 'langChainTemplates', 'orderTemplates.json');
const templatesJson = JSON.parse(fs.readFileSync(templatesPath, 'utf-8'));

// Create PromptTemplate instances from the JSON templates
export const orderPromptTemplate = new PromptTemplate({
  inputVariables: templatesJson.orderPromptTemplate.inputVariables,
  template: templatesJson.orderPromptTemplate.template,
});

export const matchUserInputTemplate = new PromptTemplate({
  inputVariables: templatesJson.matchUserInputTemplate.inputVariables,
  template: templatesJson.matchUserInputTemplate.template,
});

export const suggetionPromptTemplate = new PromptTemplate({
  inputVariables: templatesJson.suggetionPromptTemplate.inputVariables,
  template: templatesJson.suggetionPromptTemplate.template,
});