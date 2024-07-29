import express from "express";
import { getFilters } from "../controllers/filterController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(authMiddleware);

router.get("/", getFilters);

export default router;