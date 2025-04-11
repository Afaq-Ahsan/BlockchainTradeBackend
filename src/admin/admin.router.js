const router = require("express").Router();
const { validate } = require("express-validation");
const adminsController = require("./admin.controller");
const JWT = require("../common/auth/jwt");
const accessMiddleware = require("../common/middlewares/access.middleware");

router.get(
  "/stats",
  [JWT.verifyAccessToken, accessMiddleware.isAdmin],
  adminsController.getDashboardStats
);

module.exports = router;
