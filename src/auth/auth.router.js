const router = require("express").Router();
const adminRouter = require("./admin/auth.router");
const usersRouter = require("./users/auth.router");

router.use("/admin", adminRouter);
router.use("/user", usersRouter);

module.exports = router;
