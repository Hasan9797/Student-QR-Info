import userService from "../services/users.service.js";

const getUsers = async (req, res) => {
  // const lang = req.headers['accept-language'] || 'ru';
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const query = req.query || {};

  try {
    const result = await userService.getUsers(page, limit, query);
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        code: 500,
      },
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(parseInt(req.params.id));

    res.status(200).json({
      success: true,
      error: false,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        code: 500,
      },
    });
  }
};

const createUser = async (req, res) => {
  try {
    await userService.createUser(req.body);
    res.status(200).json({
      success: true,
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        code: 500,
      },
    });
  }
};

const updateUser = async (req, res) => {
  try {
    await userService.updateUser(parseInt(req.params.id), req.body);
    res.status(200).json({
      success: true,
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        code: 500,
      },
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await userService.getUserById(parseInt(req.user.id));
    res.status(200).json({
      success: true,
      error: false,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        code: 500,
      },
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(parseInt(req.params.id));
    res.status(200).json({
      success: true,
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        code: 500,
      },
    });
  }
};

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getMe,
};
