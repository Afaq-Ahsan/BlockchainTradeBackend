const Joi = require("joi");

module.exports = {
  signIn: {
    body: Joi.object({
      email: Joi.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Please enter a valid email",
      }),

      password: Joi.string().trim().required().messages({
        "string.empty": "Password is required",
      }),
      rememberMe: Joi.boolean().required(),
    }),
  },

  generateNewAccessToken: {
    body: Joi.object({
      refreshToken: Joi.string().trim().required(),
    }),
  },

  forgetPassword: {
    body: Joi.object({
      email: Joi.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Please enter a valid email",
      }),
    }),
  },

  resetPassword: {
    body: Joi.object({
      OTP: Joi.string()
        .length(6) // Assuming OTP is 6 digits
        .required()
        .messages({
          "string.empty": "OTP is required",
          "string.length": "OTP must be 6 characters long",
        }),

      email: Joi.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Please enter a valid email",
      }),
      newPassword: Joi.string().trim().min(8).required().messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters long",
      }),
      confirmPassword: Joi.string()
        .valid(Joi.ref("newPassword")) // Must match newPassword
        .required()
        .messages({
          "any.only": "Passwords do not match", // Custom message for mismatch
          "string.empty": "Confirm password is required",
        }),
    }),
  },
};
