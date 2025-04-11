const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const usersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    walletAddress: {
      type: String, // Assuming the wallet address will be a string (e.g., Ethereum address)
      default: "no_wallet",
      unique: true, // Ensure that each wallet address is unique
    },
  },
  { timestamps: true }
);

// Bcrypt middleware on UserSchema
usersSchema.pre("save", function (next) {
  var user = this;

  if (!user.isModified("password")) return next();

  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

//Password verification
usersSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};
module.exports = mongoose.model("users", usersSchema);
