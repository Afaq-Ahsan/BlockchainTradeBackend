const { StatusCodes } = require("http-status-codes");
const createError = require("http-errors");
const CONSTANTS = require("../constants/constants");
const userServices = require("../../users/users.service");

exports.isAdmin = async (req, res, next) => {
  try {
    const { id } = req.user;

    const userData = await userServices.getUser({ _id: id });

    const { role } = userData.data;

    if (role === CONSTANTS.ROLES.ADMIN) {
      next();
    } else {
      throw createError(StatusCodes.FORBIDDEN, `Only Admin can access`);
    }
  } catch (ex) {
    next(ex);
  }
};
