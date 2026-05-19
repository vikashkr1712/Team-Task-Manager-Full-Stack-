import { useEffect, useState } from "react";
import api from "../api/client.js";
import { useAuth } from "../contexts/AuthContext.jsx";

const Dashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [promoteEmail, setPromoteEmail] = useState("");
  const [promoteStatus, setPromoteStatus] = useState("");

  const loadSummary = async () => {
    try {
      const { data } = await api.get("/api/dashboard/summary");
      setSummary(data);
    } catch (err) {
      setError("Unable to load dashboard summary.");
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  const handlePromote = async (event) => {
    event.preventDefault();
    setPromoteStatus("");
    try {
      await api.post("/api/auth/promote", { email: promoteEmail });
      setPromoteStatus("User promoted to admin.");
      setPromoteEmail("");
    } catch (err) {
      setPromoteStatus(err?.response?.data?.message || "Promotion failed.");
    }
  };

  return (
    <div className="stack">
      <div className="page-head">
        <div>
          <div className="page-title">Dashboard</div>
          <p className="page-subtitle">Your assigned tasks, status, and overdue work.</p>
        </div>
      </div>

      <div className="grid grid-2">
        <section className="card">
          <h2 className="section-title">Status overview</h2>
        {error && <div className="notice">{error}</div>}
        {summary ? (
          <div className="list">
            <div className="row">
              <span>To do</span>
              <span className="tag">{summary.counts.todo}</span>
            </div>
            <div className="row">
              <span>In progress</span>
              <span className="tag">{summary.counts["in-progress"]}</span>
            </div>
            <div className="row">
              <span>Done</span>
              <span className="tag">{summary.counts.done}</span>
            </div>
          </div>
        ) : (
          <p className="muted">Loading summary...</p>
        )}
        </section>

        <section className="card">
          <h2 className="section-title">Overdue tasks</h2>
        {summary?.overdue?.length ? (
          <div className="list">
            {summary.overdue.map((task) => (
              <div key={task._id} className="row">
                <span>{task.title}</span>
                <span className="tag">{new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="muted">No overdue tasks.</p>
        )}
        </section>
      </div>

      {user?.role === "admin" && (
        <section className="card">
          <h2 className="section-title">Admin: Promote member</h2>
          <p>Enter a member email to grant admin role.</p>
          {promoteStatus && <div className="notice">{promoteStatus}</div>}
          <form onSubmit={handlePromote}>
            <label htmlFor="promoteEmail">Member email</label>
            <input
              id="promoteEmail"
              type="email"
              value={promoteEmail}
              onChange={(event) => setPromoteEmail(event.target.value)}
              required
            />
            <div className="row" style={{ marginTop: "16px" }}>
              <button type="submit">Promote to admin</button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
};

export default Dashboard;
