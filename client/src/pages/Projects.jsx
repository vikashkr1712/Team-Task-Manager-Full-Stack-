import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client.js";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [error, setError] = useState("");

  const loadProjects = async () => {
    try {
      const { data } = await api.get("/api/projects");
      setProjects(data.projects);
    } catch (err) {
      setError("Unable to load projects.");
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await api.post("/api/projects", form);
      setForm({ name: "", description: "" });
      loadProjects();
    } catch (err) {
      setError("Unable to create project.");
    }
  };

  return (
    <div className="stack">
      <div className="page-head">
        <div>
          <div className="page-title">Projects</div>
          <p className="page-subtitle">Create a project, then open it to add tasks and members.</p>
        </div>
      </div>

      <div className="grid grid-2">
        <section className="card">
          <h2 className="section-title">Create project</h2>
          {error && <div className="notice">{error}</div>}
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Project name</label>
            <input id="name" name="name" value={form.name} onChange={handleChange} required />
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
            />
            <div className="row" style={{ marginTop: "16px" }}>
              <button type="submit">Create project</button>
            </div>
          </form>
        </section>

        <section className="card">
          <h2 className="section-title">Your projects</h2>
          {projects.length ? (
            <div className="list">
              {projects.map((project) => (
                <Link key={project._id} className="card-list-item" to={`/projects/${project._id}`}>
                  <div>
                    <strong>{project.name}</strong>
                    <div className="muted">Open to create tasks</div>
                  </div>
                  <span className="tag">Open</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="muted">No projects yet.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default Projects;
