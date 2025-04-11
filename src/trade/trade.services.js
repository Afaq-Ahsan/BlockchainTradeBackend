const mongoose = require("mongoose");
const contract = require("../common/crypto/blockchainService");
const Trade = require("./trade.model");
const Offers = require("../offers/offers.services");

exports.createTrade = async (createTradeDTO, result = {}) => {
  try {
    const { tradeIdOnChain, creatorOffer, counterPartyOffer } = createTradeDTO;

    console.log("createTradeDTO : ", createTradeDTO);
    if (
      !mongoose.Types.ObjectId.isValid(creatorOffer) ||
      !mongoose.Types.ObjectId.isValid(counterPartyOffer)
    ) {
      result.notAnId = true;
    } else {
      const creatorOfferData = await Offers.getOffer(creatorOffer);
      const otherPartyOffer = await Offers.getOffer(counterPartyOffer);

      if (!creatorOfferData.data || !otherPartyOffer.data) {
        result.offerNotFound = true;
      } else {
        if (!tradeIdOnChain) {
          result.missingTradeId = true;
        } else {
          const trade = await Trade.create({
            tradeIdOnChain: tradeIdOnChain,
            creatorOffer: creatorOfferData.data._id,
            counterPartyOffer: otherPartyOffer.data._id,
            creatorEmail: creatorOfferData.data.creatorEmail,
            counterPartyEmail: otherPartyOffer.data.creatorEmail,
          });

          if (!trade) {
            result.tradeNotCreated = true;
          } else {
            result.data = trade;
          }
        }
      }
    }
  } catch (ex) {
    result.ex = ex;
  } finally {
    return result;
  }
};

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
