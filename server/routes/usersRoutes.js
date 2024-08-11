import express from "express";
import { registerNewUser,
         getUser,
         updateUserProfile,
         deleteUser, 
} from "../controllers/usersController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get('/:id', authMiddleware, getUser);
router.post('/', registerNewUser);
router.patch('/', authMiddleware, updateUserProfile);
router.delete('/:id', authMiddleware, deleteUser);

export default router;