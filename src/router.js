// const globalRouter = require("express").Router();
const authRouter = require("./auth/auth.router");
const usersRouter = require("./users/users.router");
const adminRouter = require("./admin/admin.router");
const offersRouter = require("./offers/offers.router");
const tradeRouter = require("./trade/trade.router");

exports.initRoutes = (app) => {
  app.use("/auth", authRouter);
  app.use("/admin", adminRouter);
  app.use("/user", usersRouter);
  app.use("/offers", offersRouter);
  app.use("/trade", tradeRouter);
};
