import { Schema, model, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  category: "Silk" | "Banarasi" | "Kanjivaram" | "Cotton" | "Designer" | "Wedding";
  fabric: string;
  occasion: string[];
  color: string;
  price: number;
  discountedPrice: number;
  discount: number;
  rating: number;
  reviews: number;
  images: string[];
  description: string;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isTrending: boolean;
  inStock: boolean;
  shippingCharge: number;
  stockQuantity: number;
  specifications: Map<string, string>;
  createdAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ["Silk", "Banarasi", "Kanjivaram", "Cotton", "Designer", "Wedding"],
      required: true,
    },
    fabric: { type: String, required: true },
    occasion: { type: [String], default: [] },
    color: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discountedPrice: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0, min: 0 },
    images: { type: [String], required: true },
    description: { type: String, default: "" },
    isNewArrival: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    inStock: { type: Boolean, default: true },
    // Per-product shipping charge in ₹ (existing products default to 199)
    shippingCharge: { type: Number, default: 199, min: 0 },
    // Inventory count; when it reaches 0 the product goes out of stock
    stockQuantity: { type: Number, default: 10, min: 0 },
    // Stored as a native Map in Mongo, converted to a plain object before
    // being sent to the frontend (see toJSON transform below).
    specifications: { type: Map, of: String, default: {} },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: any) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        if (ret.specifications instanceof Map) {
          ret.specifications = Object.fromEntries(ret.specifications);
        }
        return ret;
      },
    },
  }
);

export const Product = model<IProduct>("Product", productSchema);
