const Joi = require("joi");

module.exports = {
  signup: {
    body: Joi.object({
      name: Joi.string().trim().min(3).max(30).required().messages({
        "string.empty": "Username is required",
        "string.min": "Username must be at least 3 characters long",
        "string.max": "Username must be less than or equal to 30 characters",
      }),

      email: Joi.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Please enter a valid email",
      }),

      password: Joi.string().trim().min(8).required().messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters long",
      }),

      walletAddress: Joi.string().optional().messages({
        "string.empty": "walletAddress  is required",
      }),
    }),
  },

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
  connectWallet: {
    body: Joi.object({
      walletAddress: Joi.string().required().messages({
        "string.base": "Wallet Address must be a string",
        "any.required": "Wallet Address is required",
      }),
    }),
  },
};
