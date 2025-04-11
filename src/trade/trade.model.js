const mongoose = require("mongoose");

const tradeSchema = new mongoose.Schema({
  tradeIdOnChain: { type: Number, required: true }, // ID from contract

  creatorOffer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Offer",
    required: true,
  },
  counterPartyOffer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Offer",
    required: true,
  },

  creatorEmail: { type: String, required: true },
  counterPartyEmail: { type: String, required: true },

  userOneConfirmed: { type: Boolean, default: false }, // Creator
  userTwoConfirmed: { type: Boolean, default: false }, // Counter-party

  status: {
    type: String,
    enum: ["pending", "confirmed", "executed", "cancelled"],
    default: "pending",
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Trade", tradeSchema);
