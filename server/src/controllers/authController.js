import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import {
  createAccessToken,
  createRefreshToken,
  setRefreshCookie,
  clearRefreshCookie
} from "../utils/tokens.js";

const formatUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role
});

export const signup = async (req, res) => {
  const { name, email, password, role, adminSecret } = req.body;
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: "Email already in use" });
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  let userRole = "member";
  if (role === "admin") {
    if (!process.env.ADMIN_SIGNUP_SECRET) {
      return res.status(500).json({ message: "Admin signup is not configured" });
    }
    if (adminSecret !== process.env.ADMIN_SIGNUP_SECRET) {
      return res.status(403).json({ message: "Invalid admin secret" });
    }
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      return res
        .status(403)
        .json({ message: "Admin already exists. Ask an admin to promote." });
    }
    userRole = "admin";
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    passwordHash,
    role: userRole
  });

  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);
  user.refreshToken = refreshToken;
  await user.save();

  setRefreshCookie(res, refreshToken);
  res.status(201).json({ user: formatUser(user), accessToken });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.passwordHash) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);
  user.refreshToken = refreshToken;
  await user.save();

  setRefreshCookie(res, refreshToken);
  res.json({ user: formatUser(user), accessToken });
};

export const refresh = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return res.status(401).json({ message: "Missing refresh token" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.sub);
    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = createAccessToken(user);
    const newRefreshToken = createRefreshToken(user);
    user.refreshToken = newRefreshToken;
    await user.save();

    setRefreshCookie(res, newRefreshToken);
    res.json({ user: formatUser(user), accessToken });
  } catch (error) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

export const logout = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (token) {
    const user = await User.findOne({ refreshToken: token });
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
  }

  clearRefreshCookie(res);
  res.json({ message: "Logged out" });
};

export const me = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json({ user: formatUser(user) });
};

export const promoteToAdmin = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.role = "admin";
  await user.save();

  res.json({ user: formatUser(user) });
};
