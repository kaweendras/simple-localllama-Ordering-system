import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: String,
  item: String,
  size: String,
  extras: [String],
  drink: String,
  status: { type: String, default: "pending" },
  modified: { type: Boolean, default: false },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
