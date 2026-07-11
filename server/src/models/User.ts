import { Schema, model, Document, Types } from "mongoose";

export interface ICartEntry {
  product: Types.ObjectId;
  quantity: number;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string; // bcrypt hash, never store plain text
  role: "user" | "admin";
  cart: ICartEntry[];
  wishlist: Types.ObjectId[];
  createdAt: Date;
}

const cartEntrySchema = new Schema<ICartEntry>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, default: 1, min: 1 },
  },
  { _id: false }
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    // A user's cart and wishlist live directly on their account, so
    // they're available on any device once logged in, and survive
    // clearing browser storage.
    cart: { type: [cartEntrySchema], default: [] },
    wishlist: { type: [Schema.Types.ObjectId], ref: "Product", default: [] },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: any) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.password; // never send the hash to the client
        return ret;
      },
    },
  }
);

export const User = model<IUser>("User", userSchema);
