const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    userId: {
      type: String,
    },

    otp: {
      type: String,
    },

    expiresAt: {
      type: Date,
      // TTL index: documents will be deleted 1 minute after the `expiresAt` date
    },
  },
  {
    timestamps: true,
  }
);

// Optionally define TTL index separately if needed
userSchema.index({ createdAt: 1 }, { expires: 60 }); // 1 minute

const UserForgetPassword = mongoose.model("UserForgetPassword", userSchema);
module.exports = UserForgetPassword;
