const generateOtp = require("../common/otp/otpGenration");
const otp = require("./otp.model");

exports.createOTP = async (email, userId, result = {}) => {
  try {
    const createOtp = await generateOtp.generateOtp();
    const expiresAt = new Date(Date.now() + 60 * 1000); // 1 minute from now

    const otpData = await otp.findOneAndUpdate(
      { email }, // Find user by email
      { createOtp, expiresAt, userId }, // Update OTP and expiration fields
      { new: true, upsert: true } // Create if it doesn't exist, and return the new document
    );

    if (!otpData) {
      result.otpNotUpdated = true;
    } else {
      console.log(`OTP: ${createOtp}`); // Replace with actual email sending logic

      result.data = createOtp;
    }
  } catch (error) {
  } finally {
    return result;
  }
};

exports.findUser = async (email, result = {}) => {
  try {
    const otp = await otp.findOne(email);

    if (!otp) {
      result.otpNotFound = true;
    } else {
      result.data = otp;
    }
  } catch (ex) {
    result.ex = ex;
  } finally {
    return result;
  }
};
