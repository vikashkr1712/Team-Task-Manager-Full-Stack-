import Task from "../models/Task.js";
import Project from "../models/Project.js";

const canEditTask = (task, userId) => {
  const isCreator = task.createdBy.toString() === userId;
  const isAssignee = task.assignee && task.assignee.toString() === userId;
  return isCreator || isAssignee;
};

export const createTask = async (req, res) => {
  const { title, description, status, dueDate, assigneeId } = req.body;
  const projectId = req.params.projectId;

  const project = await Project.findById(projectId);
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  if (
    assigneeId &&
    !project.members.map((id) => id.toString()).includes(assigneeId)
  ) {
    return res.status(400).json({ message: "Assignee must be a project member" });
  }

  const task = await Task.create({
    title,
    description,
    status,
    dueDate,
    project: projectId,
    assignee: assigneeId || null,
    createdBy: req.user.id
  });

  res.status(201).json({ task });
};

export const listProjectTasks = async (req, res) => {
  const tasks = await Task.find({ project: req.params.projectId })
    .populate("assignee", "name email")
    .sort({ createdAt: -1 });
  res.json({ tasks });
};

export const getTask = async (req, res) => {
  const task = await Task.findById(req.params.taskId).populate("assignee", "name email");
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  const project = await Project.findById(task.project);
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  const isMember = project.members
    .map((id) => id.toString())
    .includes(req.user.id);

  if (!isMember) {
    return res.status(403).json({ message: "Not a project member" });
  }

  res.json({ task });
};

export const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.taskId);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  const project = await Project.findById(task.project);
  const isOwner = project && project.owner.toString() === req.user.id;

  if (!canEditTask(task, req.user.id) && !isOwner) {
    return res.status(403).json({ message: "Not allowed" });
  }

  const { title, description, status, dueDate, assigneeId } = req.body;
  task.title = title ?? task.title;
  task.description = description ?? task.description;
  task.status = status ?? task.status;
  task.dueDate = dueDate ?? task.dueDate;
  task.assignee = assigneeId ?? task.assignee;

  await task.save();
  res.json({ task });
};

export const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.taskId);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  const project = await Project.findById(task.project);
  const isOwner = project && project.owner.toString() === req.user.id;

  if (!canEditTask(task, req.user.id) && !isOwner) {
    return res.status(403).json({ message: "Not allowed" });
  }

  await task.deleteOne();
  res.json({ message: "Task deleted" });
};
