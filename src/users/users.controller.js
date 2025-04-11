const { StatusCodes } = require("http-status-codes");
const createError = require("http-errors");
const usersService = require("./users.service");

exports.getUsersList = async (req, res, next) => {
  try {
    const getUsersListsDto = {
      ...req.query,
    };

    const result = await usersService.getUsersList(getUsersListsDto);

    if (result.ex) throw result.ex;

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      message: "All Users list",
      data: result.data,
    });
  } catch (ex) {
    next(ex);
  }
};

exports.userCount = async (req, res, next) => {
  try {

    const result = await usersService.userCounts();

    if (result.ex) throw result.ex;

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      message: "total Users are",
      data: result.data,
    });
  } catch (ex) {
    next(ex);
  }
};
