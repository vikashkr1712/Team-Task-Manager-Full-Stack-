import { Router } from "express";
import { body } from "express-validator";
import {
  createTask,
  listProjectTasks,
  getTask,
  updateTask,
  deleteTask
} from "../controllers/taskController.js";
import { requireAuth } from "../middleware/auth.js";
import { requireProjectMember } from "../middleware/projectAccess.js";
import { validateRequest } from "../middleware/validate.js";

const router = Router();

router.use(requireAuth);

router.get("/projects/:projectId/tasks", requireProjectMember, listProjectTasks);

router.post(
  "/projects/:projectId/tasks",
  [body("title").trim().notEmpty()],
  validateRequest,
  requireProjectMember,
  createTask
);

router.get("/tasks/:taskId", getTask);

router.put(
  "/tasks/:taskId",
  [body("title").optional().trim().notEmpty()],
  validateRequest,
  updateTask
);

router.delete("/tasks/:taskId", deleteTask);

export default router;
