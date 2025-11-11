import { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import { validateRequest } from "../middleware/validate.middleware";
import { registerSchema, loginSchema } from "../schemas/auth.schema";

const router = Router();

// POST /auth/register - Register a new user
router.post("/register", validateRequest({ body: registerSchema }), register);

// POST /auth/login - Login user
router.post("/login", validateRequest({ body: loginSchema }), login);

export default router;
