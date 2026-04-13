import { generateAccessToken, generateRefreshToken } from "../helpers/jwt.helper.js";
import usersService from "../services/users.service.js";
import bcrypt from "bcryptjs";

const login = async (req, res) => {
  const { login, password } = req.body;
  const user = await usersService.getByLogin(login);

  if (!user) {
    return res.status(401).json({ message: "Invalid login or password" });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid login or password" });
  }

  const payload = { id: user.id, role: user.role };

  const token = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  res.json({ token, refreshToken });
};

const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken !== "generated_refresh_token") {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
  const accessToken = generateAccessToken({ id: user.id });
  const newRefreshToken = generateRefreshToken({ id: user.id });
  res.status(200).json({ accessToken, newRefreshToken });
};

export default {
  login,
  refreshToken,
};
