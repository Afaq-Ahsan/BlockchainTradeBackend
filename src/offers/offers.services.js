const mongoose = require("mongoose");
const Offer = require("./offers.model");
const contract = require("../common/crypto/blockchainService");
const usersService = require("../users/users.service");

exports.createOffer = async (createOfferDTO, result = {}) => {
  try {
    const creatorEmail = createOfferDTO.data.email;

    const { tokenAddress, tokenIdOrAmount, tokenType } = createOfferDTO;

    const creatorAddress = await usersService.getUser({ email: creatorEmail });

    const walletAddress = creatorAddress.data.walletAddress;

    const offerDTO = {
      creatorEmail: creatorEmail,
      creatorAddress: walletAddress,
      tokenAddress: tokenAddress,
      tokenIdOrAmount: tokenIdOrAmount,
      tokenType: tokenType,
      createdAt: new Date(),
      status: "active",
    };

    const offer = await Offer.create(offerDTO);

    if (!offer) {
      result.offerNotCreated = true;
    }
    result.data = offer;
  } catch (ex) {
    result.ex = ex;
  } finally {
    return result;
  }
};

exports.getOffersByAddress = async (getOfferDTO, result = {}) => {
  try {
    const offers = await Offer.find({ creatorAddress: getOfferDTO });

    if (!offers) {
      result.offerNotFound = true;
    }
    result.data = offers;
  } catch (ex) {
    result.ex = ex;
  } finally {
    return result;
  }
};

exports.getOffer = async (id, result = {}) => {
  try {
    const offer = await Offer.findById(id);

    if (!offer) {
      result.offerNotFound = true;
    }
    result.data = offer;
  } catch (ex) {
    result.ex = ex;
  } finally {
    return result;
  }
};

exports.getAllActiveOffers = async (result = {}) => {
  try {
    const offers = await Offer.find({ status: "active" });

    if (!offers || offers.length === 0) {
      result.offerNotFound = true;
    }

    result.data = offers;
  } catch (ex) {
    result.ex = ex;
  } finally {
    return result;
  }
};

exports.getAllOffers = async (result = {}) => {
  try {
    const offers = await Offer.find();

    if (!offers || offers.length === 0) {
      result.offerNotFound = true;
    }

    result.data = offers;
  } catch (ex) {
    result.ex = ex;
  } finally {
    return result;
  }
};

exports.updateOffer = async (updateOfferDTO, result = {}) => {
  try {
    const { id, ...remainingDTO } = updateOfferDTO;

    if ("status" in remainingDTO) {
      delete remainingDTO.status;
      console.log("You cannot update status");
    }

    const check = await Offer.findById(id);
    if (!check) {
      result.offerNotFound = true;
    } else {
      if (check.status === "completed") {
        result.offerCompleted = true;
      } else {
        const offers = await Offer.findByIdAndUpdate(id, remainingDTO, {
          new: true,
        });

        if (!offers || offers.length === 0) {
          result.offerNotFound = true;
        }

        result.data = offers;
      }
    }
  } catch (ex) {
    result.ex = ex;
  } finally {
    return result;
  }
};

exports.deleteOffer = async (id, result = {}) => {
  try {
    const check = await Offer.findById(id);
    if (!check) {
      result.offerNotFound = true;
    } else {
      if (check.status === "completed") {
        result.offerCompleted = true;
      } else {
        const offers = await Offer.findByIdAndDelete(id);
        result.data = offers;
      }
    }
  } catch (ex) {
    result.ex = ex;
  } finally {
    return result;
  }
};

//   try {
//     const { id, ...remainingDTO } = createOfferDTO;

//     const offer = await Offer.findById(id);

//     if (!offer) {
//       result.offerNotFound = true;
//     }

//     const tx = await contract.createTrade(
//       offer.counterParty,
//       offer.creatorOffer.tokenAddress,
//       offer.creatorOffer.tokenIdOrAmount,
//       offer.creatorOffer.tokenType,
//       offer.counterPartyOffer.tokenAddress,
//       offer.counterPartyOffer.tokenIdOrAmount,
//       offer.counterPartyOffer.tokenType
//     );

//     const tradeCreate = await Offer.create(remainingDTO);

//     if (!tradeCreate) {
//       result.tradeNotCreated = true;
//     }
//     result.data = offer;
//   } catch (ex) {
//     result.ex = ex;
//   } finally {
//     return result;
//   }
// };

// exports.confirmOffer = async (id, confirmOrderDTO, result = {}) => {
//   try {
//     const offer = await Offer.findById(id);
//     if (!offer) {
//       result.offerNotFound = true;
//     } else {
//       const tx = await contract.createTrade(
//         offer.counterParty,
//         offer.creatorOffer.tokenAddress,
//         offer.creatorOffer.tokenIdOrAmount,
//         offer.creatorOffer.tokenType,
//         offer.counterPartyOffer.tokenAddress,
//         offer.counterPartyOffer.tokenIdOrAmount,
//         offer.counterPartyOffer.tokenType
//       );
//     }

//     result.data = offer;
//   } catch (ex) {
//     result.ex = ex;
//   } finally {
//     return result;
//   }
// };
