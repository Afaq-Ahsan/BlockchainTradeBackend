const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    creatorEmail: { type: String, required: true },
    creatorAddress: { type: String, required: true },
    tokenAddress: { type: String, required: true },
    tokenIdOrAmount: { type: Number, required: true }, // Use Number if the value is numeric
    tokenType: {
      type: String,
      enum: ["ERC20", "ERC721", "ERC1155"],
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["active", "inActive", "completed"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Offer", offerSchema);
