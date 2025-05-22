import { Request, Response } from "express";
import * as ollama from "../services/ollama/ollamaService";
import * as openAI from "../services/openAI/openAIService";
import {
  getTempOrder,
  setTempOrder,
  deleteTempOrder,
} from "../utils/tempOrder";
import {
  createOrder,
  getLastOrderByUserId,
  getOrderById,
  updateOrder,
  getAllOrdersById,
} from "../repos/orderRepo";

import { verifyToken } from "../utils/authUtils";

import { config } from "../config/environment";

const Model = config.MODE === "local" ? ollama : openAI;

export async function handleChat(req: Request, res: Response) {
  const { message } = req.body;
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Unauthorized: Token is missing" });
    return;
  }
  const { decoded }: any = verifyToken(token);
  const userId = decoded?.userId;

  if (!userId || !message) {
    res.status(400).json({ error: "Missing userId or message" });
    return;
  }

  // Check if it's a confirmation message
  if (/yes|go ahead|confirm/i.test(message)) {
    console.log("🔍 Confirming order...");
    try {
      const tempOrder = await getTempOrder(userId);
      if (!tempOrder || !tempOrder.orderDetails) {
        res.status(400).json({ error: "No temporary order details found." });
        return;
      }
      const newOrder = await createOrder(userId, tempOrder.orderDetails);
      await deleteTempOrder(userId); // Clear the temporary order after confirmation
      console.log("✅ Order saved in db:", newOrder);
      res.json({
        reply: `Order confirmed! Your order ID is ${newOrder._id}.`,
        type: "Order Confirmation",
      });
      return;
    } catch (err) {
      console.error("❌ Error saving order in db:", err);
      res.json({ reply: "Error saving order in db" });
      return;
    }
  }

  // Check if user wants to view their order
  if (/view order|show order|view my order|show my order/i.test(message)) {
    console.log("🔍 Fetching last order...");
    const lastOrder = await getLastOrderByUserId(userId);
    if (lastOrder) {
      res.json({
        reply: `Your last order is: ${lastOrder.size} ${
          lastOrder.item
        } with ${lastOrder.extras.join(", ")} and a ${lastOrder.drink}.`,
      });
      return;
    } else {
      res.json({ reply: "No order found." });
      return;
    }
  }

  // Check if it's a modification request
  const modifyMatch = message.match(/change order (\w+)/i);
  console.log("🔍 Modifying the order");
  if (modifyMatch) {
    const orderId = modifyMatch[1];
    const order = await getOrderById(orderId);

    if (!order) {
      res.json({ reply: "Order not found." });
      return;
    }
    if (order.modified) {
      res.json({ reply: "Sorry, you can't modify the order again." });
      return;
    }

    // Extract new details
    const modifiedOrder: any = await Model.extractOrderDetails(userId, message);
    if (!modifiedOrder) {
      res.json({ reply: "Could not understand the modification." });
      return;
    }

    // Update order & ask for confirmation
    await updateOrder(order, modifiedOrder);

    res.json({
      reply: `Order updated! New details: ${modifiedOrder.size} ${
        modifiedOrder.item
      } with ${modifiedOrder.extras.join(", ")} and a ${
        modifiedOrder.drink
      }. Please confirm.`,
      modifiedOrder,
    });
    return;
  }

  if (/suggestion|recommendation|suggest|recommend/i.test(message)) {
    const pastOrders = await getAllOrdersById(userId);
    if (pastOrders && pastOrders.length > 0) {
      // Properly escape and format the past orders JSON
      const pastOrdersString = JSON.stringify(pastOrders)
        .replace(/\\/g, "\\\\") // Escape backslashes
        .replace(/"/g, '\\"') // Escape double quotes
        .replace(/\n/g, "\\n"); // Escape newlines

      // console.log("🔍 Escaped Past Orders:", pastOrdersString);

      const structuredOrderSuggestion: any = await Model.suggestItems(
        userId,
        pastOrdersString
      );
      console.log("🔍 Structured Order:", structuredOrderSuggestion);

      if (
        !structuredOrderSuggestion.orderDetails ||
        !structuredOrderSuggestion.orderDetails.items ||
        !structuredOrderSuggestion.orderDetails.size
      ) {
        res.json({
          reply: "Sorry, I couldn't understand your order. Can you try again?",
        });
        return;
      }

      if (structuredOrderSuggestion.orderDetails) {
        // Ask for confirmation
        res.json({
          reply: structuredOrderSuggestion.reply,
          orderDetails: structuredOrderSuggestion.orderDetails,
          type: structuredOrderSuggestion.type,
        });
        return;
      }
    }
  }
  //if contains"past orders" or "previous orders" or "last orders" or "my orders"
  if (/past orders|previous orders|last orders|my orders/i.test(message)) {
    const pastOrders = await getAllOrdersById(userId);
    if (pastOrders && pastOrders.length > 0) {
      console.log("🔍 Past Orders:", pastOrders);
      res.json(pastOrders);
      return;
    } else {
      res.json({ reply: "No order found." });
      return;
    }
  } else {
    // Extract order details if the message is about an order
    const structuredOrder: any = await Model.extractOrderDetails(
      userId,
      message
    );

    if (
      !structuredOrder.orderDetails ||
      !structuredOrder.orderDetails.items ||
      !structuredOrder.orderDetails.size
    ) {
      res.json({
        reply: "Sorry, I couldn't understand your order. Can you try again?",
      });
      return;
    }

    if (structuredOrder.orderDetails) {
      // Ask for confirmation
      res.json({
        reply: structuredOrder.reply,
        orderDetails: structuredOrder.orderDetails,
        type: structuredOrder.type,
      });
      return;
    }
  }

  res.json({ reply: "I'm not sure what you mean. Can you clarify?" });
}

export const handleUserResponse = async (req: Request, res: Response) => {
  const { message } = req.body;
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Unauthorized: Token is missing" });
    return;
  }
  const { decoded }: any = verifyToken(token);
  const userId = decoded?.userId;

  if (!userId || !message) {
    res.status(400).json({ error: "Missing userId or message" });
    return;
  }

  if (!userId || !message) {
    res.status(400).json({ error: "Missing userId or message" });
    return;
  }

  const userResponse = await Model.matchUserInput(message);
  console.log("🔍 User response:", userResponse);
  res.json({ reply: userResponse });
};
