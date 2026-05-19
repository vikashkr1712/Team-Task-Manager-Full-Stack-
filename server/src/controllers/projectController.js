import Project from "../models/Project.js";
import User from "../models/User.js";

export const createProject = async (req, res) => {
  const { name, description } = req.body;
  const project = await Project.create({
    name,
    description,
    owner: req.user.id,
    members: [req.user.id]
  });

  res.status(201).json({ project });
};

export const listProjects = async (req, res) => {
  const projects = await Project.find({ members: req.user.id }).sort({ createdAt: -1 });
  res.json({ projects });
};

export const getProject = async (req, res) => {
  const project = await Project.findById(req.params.projectId).populate("members", "name email role");
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  const isMember = project.members
    .map((member) => member._id.toString())
    .includes(req.user.id);

  if (!isMember) {
    return res.status(403).json({ message: "Not a project member" });
  }

  res.json({ project });
};

export const updateProject = async (req, res) => {
  const { name, description } = req.body;
  const project = await Project.findByIdAndUpdate(
    req.params.projectId,
    { name, description },
    { new: true }
  );
  res.json({ project });
};

export const deleteProject = async (req, res) => {
  await Project.findByIdAndDelete(req.params.projectId);
  res.json({ message: "Project deleted" });
};

export const addMember = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const project = await Project.findById(req.params.projectId);
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  const exists = project.members.map((id) => id.toString()).includes(user._id.toString());
  if (!exists) {
    project.members.push(user._id);
    await project.save();
  }

  res.json({ project });
};

export const removeMember = async (req, res) => {
  const { memberId } = req.body;
  const project = await Project.findById(req.params.projectId);
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  if (project.owner.toString() === memberId) {
    return res.status(400).json({ message: "Owner cannot be removed" });
  }

  project.members = project.members.filter((id) => id.toString() !== memberId);
  await project.save();

  res.json({ project });
};
