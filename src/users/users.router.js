const router = require("express").Router();
const { validate } = require("express-validation");
const usersController = require("./users.controller");
const usersValidation = require("./users.validation");


router.get(
  "/userList",
  [
    validate(usersValidation.usersList, { keyByField: true }),
  ],
  usersController.getUsersList
);

router.get(
  "/userCount", usersController.userCount
);



module.exports = router;
