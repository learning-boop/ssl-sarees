import mongoose, { Schema, Document, Types } from "mongoose";

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export interface IOrderItem {
  productId: string;
  name: string;
  image: string;
  price: number; // price paid per unit (discounted price at time of order)
  quantity: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  user?: Types.ObjectId; // optional: guests can also place orders
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: IOrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Items are stored as a SNAPSHOT (name/image/price copied at purchase
// time) so that editing or deleting a product later never corrupts
// historical orders or changes past revenue figures.
const orderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    customer: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, required: true, min: 0 },
    shipping: { type: Number, required: true, min: 0 },
    discount: { type: Number, required: true, min: 0, default: 0 },
    total: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  {
   transform: (_doc, ret: Record<string, unknown>) => {
  ret.id = String(ret._id);
  delete ret._id;
  return ret;
},
    },
  }
);

export const Order = mongoose.model<IOrder>("Order", orderSchema);
