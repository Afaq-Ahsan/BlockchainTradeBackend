const { StatusCodes } = require("http-status-codes");
const createError = require("http-errors");
const offerService = require("./offers.services");

exports.createOffer = async (req, res, next) => {
  try {
    const data = req.user;
    const createOfferDto = { ...req.body, data };

    const result = await offerService.createOffer(createOfferDto);

    if (result.ex) throw result.ex;

    if (result.offerNotCreated) {
      throw new createError(StatusCodes.NOT_IMPLEMENTED, "Offer Not Created");
    }

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      message: "Offer Created",
      data: result.data,
    });
  } catch (ex) {
    next(ex);
  }
};

exports.getOffersByAddress = async (req, res, next) => {
  try {
    const getOfferDTO = req.params.address;

    const result = await offerService.getOffersByAddress(getOfferDTO);

    if (result.ex) throw result.ex;

    if (result.offerNotFound) {
      throw new createError(StatusCodes.NOT_FOUND, "Offer Not Found");
    }

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      message: "All Offers list",
      data: result.data,
    });
  } catch (ex) {
    next(ex);
  }
};

exports.getOffer = async (req, res, next) => {
  try {
    const id = req.params.id;

    const result = await offerService.getOffer(id);

    if (result.ex) throw result.ex;

    if (result.offerNotFound) {
      throw new createError(StatusCodes.NOT_FOUND, "Offer Not Found");
    }

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      message: "All Offers list",
      data: result.data,
    });
  } catch (ex) {
    next(ex);
  }
};

exports.getAllActiveOffers = async (req, res, next) => {
  try {
    const result = await offerService.getAllActiveOffers();

    if (result.ex) throw result.ex;

    if (result.offerNotFound) {
      throw new createError(StatusCodes.NOT_FOUND, "Offers Not Found");
    }

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      message: "All Offers list",
      data: result.data,
    });
  } catch (ex) {
    next(ex);
  }
};

exports.getAllOffers = async (req, res, next) => {
  try {
    const result = await offerService.getAllOffers();

    if (result.ex) throw result.ex;

    if (result.offerNotFound) {
      throw new createError(StatusCodes.NOT_FOUND, "Offers Not Found");
    }

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      message: "All Offers list",
      data: result.data,
    });
  } catch (ex) {
    next(ex);
  }
};

exports.updateOffer = async (req, res, next) => {
  try {
    const updateOfferDTO = req.body;

    const result = await offerService.updateOffer(updateOfferDTO);

    if (result.ex) throw result.ex;

    if (result.offerNotFound) {
      throw new createError(StatusCodes.NOT_FOUND, "Offers Not Found");
    }

    if (result.offerCompleted) {
      throw new createError(
        StatusCodes.NOT_MODIFIED,
        "Offer is completed and can't be modified"
      );
    }

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      message: "All Offers list",
      data: result.data,
    });
  } catch (ex) {
    next(ex);
  }
};

exports.deleteOffer = async (req, res, next) => {
  try {
    const id = req.params.id;

    const result = await offerService.deleteOffer(id);

    if (result.ex) throw result.ex;

    if (result.offerNotFound) {
      throw new createError(StatusCodes.NOT_FOUND, "Offers Not Found");
    }

    if (result.offerCompleted) {
      throw new createError(
        StatusCodes.NOT_MODIFIED,
        "Offer is completed and can't be delete"
      );
    }

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      message: "All Offers list",
      data: result.data,
    });
  } catch (ex) {
    next(ex);
  }
};
