const router = require("express").Router();
const { validate } = require("express-validation");
const JWT = require("../common/auth/jwt");
const offersController = require("./trade.controller");

router.post(
  "/createTrade",
  JWT.verifyAccessToken,
  offersController.createTrade
);

module.exports = router;
