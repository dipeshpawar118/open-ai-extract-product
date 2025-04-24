import express from "express";
import { parseProductController } from "../controllers/productController.js";

const router = express.Router();

router.post("/parse-product", parseProductController);

export default router;
