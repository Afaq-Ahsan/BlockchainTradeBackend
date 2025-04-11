const { StatusCodes } = require("http-status-codes");
const createError = require("http-errors");
const offerService = require("./trade.services");

exports.createTrade = async (req, res, next) => {
  try {
    const createOfferDto = req.body;

    const result = await offerService.createTrade(createOfferDto);

    if (result.ex) throw result.ex;

    if (result.notAnId) {
      throw new createError(StatusCodes.NO_CONTENT, "Not an offer Id");
    }

    if (result.offerNotFound) {
      throw new createError(StatusCodes.NOT_FOUND, "Offer Not Found");
    }

    if (result.missingTradeId) {
      throw new createError(StatusCodes.NOT_FOUND, "trade is missing");
    }

    if (result.tradeNotCreated) {
      throw new createError(StatusCodes.NOT_IMPLEMENTED, "trade not created");
    }

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      message: "trade Created",
      data: result.data,
    });
  } catch (ex) {
    next(ex);
  }
};
