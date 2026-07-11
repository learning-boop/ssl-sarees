import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "./db";
import { User } from "./models/User";

/**
 * One-time script: updates the admin account's email + password in the
 * database to the values in server/.env (ADMIN_EMAIL / ADMIN_PASSWORD /
 * ADMIN_NAME).
 *
 * Run from the server folder:   npx tsx src/update-admin.ts
 */
async function main() {
  await connectDB();

  const newEmail = process.env.ADMIN_EMAIL;
  const newPassword = process.env.ADMIN_PASSWORD;
  const newName = process.env.ADMIN_NAME || "Admin";

  if (!newEmail || !newPassword) {
    console.error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in server/.env");
    process.exit(1);
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  // If an account with the new email already exists, update it in place.
  const existingWithNewEmail = await User.findOne({ email: newEmail });
  if (existingWithNewEmail) {
    existingWithNewEmail.password = hashed;
    existingWithNewEmail.role = "admin";
    existingWithNewEmail.name = newName;
    await existingWithNewEmail.save();
    console.log(`Updated existing account to admin with new password: ${newEmail}`);
  } else {
    // Otherwise, find the current admin account and change its email + password.
    const admin = await User.findOne({ role: "admin" });
    if (admin) {
      console.log(`Changing admin ${admin.email} -> ${newEmail}`);
      admin.email = newEmail;
      admin.password = hashed;
      admin.name = newName;
      await admin.save();
      console.log("Admin credentials updated.");
    } else {
      await User.create({ name: newName, email: newEmail, password: hashed, role: "admin" });
      console.log(`No admin found — created new admin: ${newEmail}`);
    }
  }

  await mongoose.disconnect();
  console.log("Done. You can now log in with the new credentials.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
