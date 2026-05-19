import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client.js";
import { useAuth } from "../contexts/AuthContext.jsx";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    status: "todo",
    dueDate: "",
    assigneeId: ""
  });
  const [memberEmail, setMemberEmail] = useState("");
  const [error, setError] = useState("");

  const isOwner = useMemo(() => {
    if (!project || !user) return false;
    return project.owner === user.id || project.owner?._id === user.id;
  }, [project, user]);

  const loadProject = async () => {
    try {
      const { data } = await api.get(`/api/projects/${projectId}`);
      setProject(data.project);
    } catch (err) {
      setError("Unable to load project.");
    }
  };

  const loadTasks = async () => {
    try {
      const { data } = await api.get(`/api/projects/${projectId}/tasks`);
      setTasks(data.tasks);
    } catch (err) {
      setError("Unable to load tasks.");
    }
  };

  useEffect(() => {
    loadProject();
    loadTasks();
  }, [projectId]);

  const handleTaskChange = (event) => {
    setTaskForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleCreateTask = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await api.post(`/api/projects/${projectId}/tasks`, {
        ...taskForm,
        dueDate: taskForm.dueDate || null
      });
      setTaskForm({ title: "", description: "", status: "todo", dueDate: "", assigneeId: "" });
      loadTasks();
    } catch (err) {
      setError("Unable to create task.");
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await api.put(`/api/tasks/${taskId}`, { status });
      loadTasks();
    } catch (err) {
      setError("Unable to update task.");
    }
  };

  const handleAddMember = async (event) => {
    event.preventDefault();
    try {
      await api.post(`/api/projects/${projectId}/members`, { email: memberEmail });
      setMemberEmail("");
      loadProject();
    } catch (err) {
      setError("Unable to add member.");
    }
  };

  return (
    <div className="stack">
      <div className="page-head">
        <div>
          <div className="page-title">{project?.name || "Project"}</div>
          <p className="page-subtitle">
            You are inside this project. Tasks created here belong to this project only.
          </p>
        </div>
        <span className="tag">Members {project?.members?.length || 0}</span>
      </div>

      {project?.description && <p className="muted">{project.description}</p>}
      {error && <div className="notice">{error}</div>}

      <div className="grid grid-2">
        <section className="card">
          <h2 className="section-title">Team</h2>
          {isOwner ? (
            <form onSubmit={handleAddMember}>
              <label htmlFor="memberEmail">Add member by email</label>
              <input
                id="memberEmail"
                value={memberEmail}
                onChange={(event) => setMemberEmail(event.target.value)}
                type="email"
                required
              />
              <div className="row" style={{ marginTop: "12px" }}>
                <button type="submit">Add member</button>
              </div>
            </form>
          ) : (
            <p className="muted">Only the project owner can add members.</p>
          )}
        </section>

        <section className="card">
          <h2 className="section-title">Create task for this project</h2>
          <p className="helper">Pick an assignee from this project’s members.</p>
          <form onSubmit={handleCreateTask}>
            <label htmlFor="title">Title</label>
            <input id="title" name="title" value={taskForm.title} onChange={handleTaskChange} required />
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={taskForm.description}
              onChange={handleTaskChange}
              rows="3"
            />
            <div className="split">
              <div>
                <label htmlFor="status">Status</label>
                <select id="status" name="status" value={taskForm.status} onChange={handleTaskChange}>
                  <option value="todo">To do</option>
                  <option value="in-progress">In progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div>
                <label htmlFor="dueDate">Due date</label>
                <input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={taskForm.dueDate}
                  onChange={handleTaskChange}
                />
              </div>
            </div>
            <label htmlFor="assigneeId">Assignee</label>
            <select id="assigneeId" name="assigneeId" value={taskForm.assigneeId} onChange={handleTaskChange}>
              <option value="">Unassigned</option>
              {project?.members?.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name} ({member.email})
                </option>
              ))}
            </select>
            <div className="row" style={{ marginTop: "16px" }}>
              <button type="submit">Create task</button>
            </div>
          </form>
        </section>
      </div>

      <section className="card">
        <h2 className="section-title">Task list</h2>
        {tasks.length ? (
          <div className="list">
            {tasks.map((task) => (
              <div key={task._id} className="card-list-item">
                <div>
                  <strong>{task.title}</strong>
                  <div className="muted">{task.description || "No description"}</div>
                </div>
                <div className="row">
                  <select
                    value={task.status}
                    onChange={(event) => handleStatusChange(task._id, event.target.value)}
                  >
                    <option value="todo">To do</option>
                    <option value="in-progress">In progress</option>
                    <option value="done">Done</option>
                  </select>
                  {task.dueDate && (
                    <span className="tag">{new Date(task.dueDate).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="muted">No tasks yet.</p>
        )}
      </section>
    </div>
  );
};

export default ProjectDetail;
