const router = require("express").Router();
const { validate } = require("express-validation");
const authController = require("./auth.controller");
const authValidation = require("./auth.validation");
const JWT = require("../../common/auth/jwt");

router.post(
  "/signin",
  [validate(authValidation.signIn, { keyByField: true })],
  authController.signin
);

router.post(
  "/refresh-token",
  [
    validate(authValidation.generateNewAccessToken, { keyByField: true }),
    JWT.verifyRefreshToken,
  ],
  authController.refreshToken
);

router.post(
  "/forgetpassword",
  [validate(authValidation.forgetPassword, { keyByField: true })],
  authController.forgetPassword
);

router.post(
  "/reset-password",
  [
    // JWT.verifyPasswordResetToken,
    validate(authValidation.resetPassword, { keyByField: true }),
  ],
  authController.resetPassword
);

router.delete("/logout", [JWT.verifyAccessToken], authController.logout);

module.exports = router;
