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

  const token = "generated_jwt_token";
  const refreshToken = "generated_refresh_token";
  res.json({ token, refreshToken });
};

const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken !== "generated_refresh_token") {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
  const token = "generated_jwt_token";
  res.status(200).json({ token });
};

export default {
  login,
  refreshToken,
};
