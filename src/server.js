import express from "express";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use("/api", productRoutes);

app.get("", (req, res) => {
  res.status(200).json({ message: "Open AI Powered Product extract Server is running" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

