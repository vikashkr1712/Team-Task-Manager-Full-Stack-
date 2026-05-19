import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "member",
    adminSecret: ""
  });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role
      };
      if (form.role === "admin") {
        payload.adminSecret = form.adminSecret;
      }
      await signup(payload);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Signup failed. Try again.");
    }
  };

  return (
    <div className="card auth-card">
      <h1>Create account</h1>
      <p>Start a new workspace for your team.</p>
      {error && <div className="notice">{error}</div>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" value={form.name} onChange={handleChange} required />
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <label htmlFor="role">Role</label>
        <select id="role" name="role" value={form.role} onChange={handleChange}>
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
        {form.role === "admin" && (
          <>
            <label htmlFor="adminSecret">Admin secret</label>
            <input
              id="adminSecret"
              name="adminSecret"
              type="password"
              value={form.adminSecret}
              onChange={handleChange}
              required
            />
            <p className="helper">Only the first admin can be created with the secret.</p>
          </>
        )}
        <div className="row" style={{ marginTop: "16px" }}>
          <button type="submit">Create account</button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
