import Task from "../models/Task.js";

export const getSummary = async (req, res) => {
  const userId = req.user.id;
  const tasks = await Task.find({ assignee: userId });

  const counts = tasks.reduce(
    (acc, task) => {
      acc[task.status] += 1;
      return acc;
    },
    { todo: 0, "in-progress": 0, done: 0 }
  );

  const overdue = tasks.filter(
    (task) => task.dueDate && task.dueDate < new Date() && task.status !== "done"
  );

  res.json({ counts, overdue });
};
