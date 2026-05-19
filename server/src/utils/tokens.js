import jwt from "jsonwebtoken";

export const createAccessToken = (user) =>
  jwt.sign({ sub: user._id, role: user.role }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m"
  });

export const createRefreshToken = (user) =>
  jwt.sign({ sub: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d"
  });

export const setRefreshCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/api/auth"
  });
};

export const clearRefreshCookie = (res) => {
  res.clearCookie("refreshToken", { path: "/api/auth" });
};
