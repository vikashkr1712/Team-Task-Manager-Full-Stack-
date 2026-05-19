import { Router } from "express";
import { body } from "express-validator";
import {
  login,
  signup,
  refresh,
  logout,
  me,
  promoteToAdmin
} from "../controllers/authController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validate.js";

const router = Router();

router.post(
  "/signup",
  [
    body("name").trim().notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("role").optional().isIn(["admin", "member"]),
    body("adminSecret").optional().isString()
  ],
  validateRequest,
  signup
);

router.post(
  "/login",
  [body("email").isEmail(), body("password").notEmpty()],
  validateRequest,
  login
);

router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", requireAuth, me);
router.post(
  "/promote",
  requireAuth,
  requireRole("admin"),
  [body("email").isEmail()],
  validateRequest,
  promoteToAdmin
);

export default router;
