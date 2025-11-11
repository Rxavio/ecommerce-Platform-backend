import { Router } from "express";
import { register } from "../controllers/auth.controller";
import { validateRequest } from "../middleware/validate.middleware";
import { registerSchema } from "../schemas/auth.schema";

const router = Router();

// POST /auth/register - Register a new user
router.post("/register", validateRequest({ body: registerSchema }), register);

export default router;
