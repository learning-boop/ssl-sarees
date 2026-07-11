import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "./db";
import { User } from "./models/User";
import { Product } from "./models/Product";
// Reuses your existing frontend product catalog so the admin dashboard
// starts out populated instead of empty. tsx can execute this .ts import
// directly, no build step needed.
import { products } from "../../src/data/products";

async function main() {
  await connectDB();

  const adminEmail = process.env.ADMIN_EMAIL || "admin@sslsarees.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const adminName = process.env.ADMIN_NAME || "Admin";

  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const hashed = await bcrypt.hash(adminPassword, 10);
    await User.create({ name: adminName, email: adminEmail, password: hashed, role: "admin" });
    console.log(`Created admin account: ${adminEmail}`);
  } else {
    console.log(`Admin account already exists: ${adminEmail}`);
  }

  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    // Drop the old string "id" field — MongoDB generates its own _id.
    const docs = products.map(({ id, ...rest }) => rest);
    await Product.insertMany(docs);
    console.log(`Imported ${docs.length} products from src/data/products.ts`);
  } else {
    console.log(`Products collection already has ${productCount} documents, skipping import`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
