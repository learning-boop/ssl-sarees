import app from "./app";
import { connectDB } from "./db";

const PORT = Number(process.env.PORT) || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`SSL Sarees API running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });
