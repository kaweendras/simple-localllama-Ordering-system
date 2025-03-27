export interface OrderDetails {
  items: string[];
  size: string[];
  extras: string[];
  drink: string[];
}

export interface OrderResponse {
  reply: string;
  orderDetails: OrderDetails;
  type: string;
}

export interface UserConfirmation {
  userResponse: "yes" | "no";
}
