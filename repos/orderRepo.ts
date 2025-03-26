import Order from "../models/Order";

export interface OrderDetails {
  items: string[];
  size: string[];
  extras: string[];
  drink: string[];
}

export async function createOrder(userId: string, orderDetails: OrderDetails) {
  try {
    const newOrder = new Order({
      userId,
      item: orderDetails.items[0],
      size: orderDetails.size[0],
      extras: orderDetails.extras,
      drink: orderDetails.drink[0],
    });
    return await newOrder.save();
  } catch (err) {
    console.error("❌ Error saving order in db:", err);
    throw err;
  }
}

export async function getLastOrderByUserId(userId: string) {
  return await Order.findOne({ userId }).sort({ _id: -1 });
}

export async function getOrderById(orderId: string) {
  return await Order.findById(orderId);
}

export async function updateOrder(order: any, modifiedOrder: any) {
  Object.assign(order, modifiedOrder, { modified: true });
  return await order.save();
}
