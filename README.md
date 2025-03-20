# Place orders with AI

An AI-powered chatbot system for handling food orders through natural language processing.

## Overview

OrderAI is a Node.js application that uses AI to process natural language food orders. Users can place orders, view their order history, modify orders, and confirm orders through a conversational interface.

## Disclaimer

**Note**: This project is currently in development and not intended for production use. OrderAI is designed purely as an educational tool to explore and learn about the application of AI in everyday life.

## Features

- Natural language order processing
- Order confirmation flow
- Order modification
- Order history viewing
- Structured data extraction from free-text messages

## Requirements

- Node.js should be installed in your system
- Ollama instance should be running

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/kaweendras/simple-localllama-Ordering-system.git
   cd simple-localllama-Ordering-system
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up environment variables:

   ```
   cp .env.example .env
   ```

   Then edit `.env` with your configuration.

4. Start the server:
   ```
   npm start
   ```

## Usage

The system exposes a REST API that can be integrated with any front-end or messaging platform.

### API Endpoints

#### POST /api/chat

Process a chat message and handle order logic.

**Request Body:**

```json
{
  "userId": "user123",
  "message": "I'd like to order a large pizza with extra cheese and a coke"
}
```

**Response:**

```json
{
  "reply": "I've got your order: large pizza with extra cheese and a coke. Would you like to confirm?",
  "orderDetails": {
    "items": ["pizza"],
    "size": ["large"],
    "extras": ["extra cheese"],
    "drink": ["coke"]
  }
}
```

## Example Commands

- Place an order: "I want a medium burger with fries and a milkshake"
- View order: "show my order"
- Modify order: "change order 12345 to a large burger and add bacon"
- Confirm order: "yes" or "confirm"

## Technologies

- Node.js
- Express
- MongoDB/Mongoose
- Ollama for NLP processing

## Project Structure

- `/controllers` - Request handlers
- `/models` - Database models
- `/services` - Business logic including AI processing
- `/routes` - API routes

## License

MIT
