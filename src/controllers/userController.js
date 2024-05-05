const { where } = require("sequelize");
const { User } = require("./../models");
const bcrypt = require("bcrypt");
const getAll = async (req, res, next) => {
  try {
    const users = await User.findAll();
    if (users) {
      return res
        .status(200)
        .json({
          success: true,
          message: "Successfully Fetched the Users",
          data: users,
        });
    } else {
      return res
        .status(200)
        .json({ success: false, message: "No users found", data: [] });
    }
  } catch (error) {
    console.log(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      return res
        .status(200)
        .json({
          success: true,
          message: "Successfully fetched the user",
          data: user,
        });
    } else {
      return res
        .status(200)
        .json({ success: false, message: "No user found", data: {} });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Error occured" });
  }
};

const create = async (req, res, next) => {
  try {
    const userExists = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User Alread Exists" });
    } else {
      const user = await User.create({
          ...req.body,
          password: bcrypt.hashSync(req.body.password, 10),
      });
      if (user) {
        return res
          .status(200)
          .json({
            success: true,
            message: "Successfully created the user",
            data: user,
          });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const update = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      const updatedUser = await User.Update(
        {  ...req.body,password: user.password },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      return res
        .status(200)
        .json({
          success: true,
          message: "Successfully Updated the user",
          data: updatedUser,
        });
    } else {
      return res.status(404).json({ success: false, message: "No user found" });
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.destroy();
      return res
        .status(200)
        .json({ success: true, message: "Successfully deleted the user" });
    } else {
      return res.status(404).json({ success: false, message: "No user found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Error occured" });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  deleteUser,
};
