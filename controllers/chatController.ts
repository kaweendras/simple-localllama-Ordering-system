import { Request, Response } from "express";
import {
  extractOrderDetails,
  tempOrder,
  matchUserInput,
} from "../services/ollamaService";
import {
  createOrder,
  getLastOrderByUserId,
  getOrderById,
  updateOrder,
} from "../repos/orderRepo";

export async function handleChat(req: Request, res: Response) {
  const { userId, message } = req.body;

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
      res.json({ reply: `Order confirmed! Your order ID is ${newOrder._id}.` });
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
  const { userId, message } = req.body;

  if (!userId || !message) {
    res.status(400).json({ error: "Missing userId or message" });
    return;
  }

  const userResponse = await matchUserInput(message);
  console.log("🔍 User response:", userResponse);
  res.json({ reply: userResponse });
};
