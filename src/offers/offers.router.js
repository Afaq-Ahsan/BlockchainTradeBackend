const router = require("express").Router();
const { validate } = require("express-validation");
const JWT = require("../common/auth/jwt");
const offersController = require("./offers.controller");

router.post(
  "/createOffer",
  JWT.verifyAccessToken,
  offersController.createOffer
);

router.get("/OffersByAddress/:address", offersController.getOffersByAddress);
router.get("/Offer/:id", offersController.getOffer);

router.get("/AllActiveOffers", offersController.getAllActiveOffers);
router.get("/AllOffers", offersController.getAllOffers);

router.put("/updateOffer", JWT.verifyAccessToken, offersController.updateOffer);

router.put("/deleteOffer/:id", JWT.verifyAccessToken, offersController.deleteOffer);

module.exports = router;
