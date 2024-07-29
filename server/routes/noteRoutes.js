import express from "express";
import { 
    getNotes, 
    getNote,
    createNote,
    removeNote,
    updateNote,
} from "../controllers/noteController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(authMiddleware);

router.get("/user/:id", getNotes);
router.post("/", createNote);
router.get("/:id", getNote);
router.delete("/:id", removeNote);
router.patch("/:id", updateNote);

export default router;