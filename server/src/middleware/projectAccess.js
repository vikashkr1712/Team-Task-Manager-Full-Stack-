import Project from "../models/Project.js";

export const requireProjectMember = async (req, res, next) => {
  const projectId = req.params.projectId || req.body.projectId;
  if (!projectId) {
    return res.status(400).json({ message: "Project id is required" });
  }

  const project = await Project.findById(projectId);
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  const isMember = project.members
    .map((id) => id.toString())
    .includes(req.user.id);

  if (!isMember) {
    return res.status(403).json({ message: "Not a project member" });
  }

  req.project = project;
  next();
};

export const requireProjectOwner = async (req, res, next) => {
  const projectId = req.params.projectId || req.body.projectId;
  if (!projectId) {
    return res.status(400).json({ message: "Project id is required" });
  }

  const project = await Project.findById(projectId);
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  if (project.owner.toString() !== req.user.id) {
    return res.status(403).json({ message: "Owner access required" });
  }

  req.project = project;
  next();
};
