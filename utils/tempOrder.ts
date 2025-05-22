import { OrderResponse } from "../types/order";
import redisClient from "../config/redisClient";

export const setTempOrder = async (userId: string, order: OrderResponse) => {
  await redisClient.set(userId, JSON.stringify(order));
};

export const getTempOrder = async (userId: string) => {
  const order = await redisClient.get(userId);
  console.log("Order from Redis:", order ? JSON.parse(order) : null);
  return order ? JSON.parse(order) : null;
};

export const deleteTempOrder = async (userId: string) => {
  await redisClient.del(userId);
};
