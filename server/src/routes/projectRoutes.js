import { Router } from "express";
import { body } from "express-validator";
import {
  createProject,
  listProjects,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember
} from "../controllers/projectController.js";
import { requireAuth } from "../middleware/auth.js";
import { requireProjectOwner } from "../middleware/projectAccess.js";
import { validateRequest } from "../middleware/validate.js";

const router = Router();

router.use(requireAuth);

router.get("/", listProjects);

router.post(
  "/",
  [body("name").trim().notEmpty()],
  validateRequest,
  createProject
);

router.get("/:projectId", getProject);

router.put(
  "/:projectId",
  [body("name").optional().trim().notEmpty()],
  validateRequest,
  requireProjectOwner,
  updateProject
);

router.delete("/:projectId", requireProjectOwner, deleteProject);

router.post(
  "/:projectId/members",
  [body("email").isEmail()],
  validateRequest,
  requireProjectOwner,
  addMember
);

router.delete(
  "/:projectId/members",
  [body("memberId").notEmpty()],
  validateRequest,
  requireProjectOwner,
  removeMember
);

export default router;
