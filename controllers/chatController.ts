import { Request, Response } from "express";
import {
  extractOrderDetails,
  tempOrder,
  matchUserInput,
  suggestItems,
} from "../services/ollamaService";
import {
  createOrder,
  getLastOrderByUserId,
  getOrderById,
  updateOrder,
  getAllOrdersById,
} from "../repos/orderRepo";

import { verifyToken } from "../utils/authUtils";

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
    try {
      if (!tempOrder || !tempOrder.orderDetails) {
        res.status(400).json({ error: "No temporary order details found." });
        return;
      }
      const newOrder = await createOrder(userId, tempOrder.orderDetails);
      res.json({ reply: `Order confirmed! Your order ID is ${newOrder._id}.` ,type: "Order Confirmation"});
      return;
    } catch (err) {
      console.error("❌ Error saving order in db:", err);
      res.json({ reply: "Error saving order in db" });
      return;
    }
  }

  // Check if user wants to view their order
  if (/view order|show order|view my order|show my order/i.test(message)) {
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
    const modifiedOrder: any = await extractOrderDetails(message);
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

      console.log("🔍 Escaped Past Orders:", pastOrdersString);

      const structuredOrderSuggestion: any = await suggestItems(pastOrdersString);
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
  } else {
    // Extract order details if the message is about an order
    const structuredOrder: any = await extractOrderDetails(message);

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

  const userResponse = await matchUserInput(message);
  console.log("🔍 User response:", userResponse);
  res.json({ reply: userResponse });
}
