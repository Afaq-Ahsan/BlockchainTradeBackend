const usersService = require("../../users/users.service");
const { JWT_TOKEN_TYPES } = require("../../../helpers/constants");
const JWT = require("../../common/auth/jwt");
const configs = require("../../../configs");
const redisClient = require("../../../helpers/redis");
const userServices = require("../../users/users.service");
const otpServices = require("../../otp/otp.service");

exports.signUp = async (signUpDto, result = {}) => {
  try {
    const { email } = signUpDto;
    const alreadyExist = await userServices.getUser({ email: email });

    if (alreadyExist.notFound) {
      
      signUpDto.walletAddress = signUpDto.walletAddress.toLowerCase();

      const newUser = await userServices.createNewUser(signUpDto);

      if (newUser.newUserNotCreated) {
        result.userNotCreated = true;
      }

      result.data = newUser;
    } else {
      result.alreadyexist = true;
    }
  } catch (ex) {
    result.ex = ex;
  } finally {
    return result;
  }
};

exports.signIn = async (signInDto, result = {}) => {
  try {
    const { email, password, rememberMe } = signInDto;

    const userExist = await userServices.getUser({ email });

    if (!userExist.data) {
      result.userNotFound = true;
    } else {
      const user = userExist.data;

      const isValid = await user.comparePassword(password);

      if (!isValid) {
        result.wrongPassword = true;
      } else {
        const [accessToken, refreshToken] = await Promise.all([
          JWT.signToken(
            {
              id: user._id,
              email: user.email,
            },
            JWT_TOKEN_TYPES.ACCESS_TOKEN
          ),
          JWT.signToken(
            {
              id: user._id,
              email: user.email,
            },
            JWT_TOKEN_TYPES.REFRESH_TOKEN,
            rememberMe
          ),
        ]);

        rememberMe
          ? await redisClient.set(user.id.toString(), refreshToken, {
              EX: configs.jwt.refreshToken.redisRemeberMeTTL,
            })
          : await redisClient.set(user.id.toString(), refreshToken, {
              EX: configs.jwt.refreshToken.redisTTL,
            });

        result.data = {
          userId: user._id,
          accessToken,
          refreshToken,
        };
      }
    }
  } catch (ex) {
    result.ex = ex;
  } finally {
    return result;
  }
};

exports.connectWallet = async (user, walletAddress, result = {}) => {
  try {
    const response = await userServices.updateContractAddress({
      user: user,
      walletAddress: walletAddress,
    });

    console.log("response", response);

    if (response.alreadyAvailable) {
      result.alreadyExist = true;
    }

    if (response.userNotFound) {
      result.alreadyExist = true;
    }

    result.data = response.data;
  } catch (ex) {
    result.ex = ex;
  } finally {
    return result;
  }
};

exports.refreshToken = async (refreshTokenDTO, result = {}) => {
  try {
    const { userId } = refreshTokenDTO;

    const response = await userServices.getUser({ _id: userId });

    if (response.ex) throw response.ex;

    if (!response.data) {
      result.userNotFound = true;
    } else {
      const accessToken = await JWT.signToken(
        { id: response.data.id, email: response.data.email },
        JWT_TOKEN_TYPES.ACCESS_TOKEN
      );

      result.data = { accessToken };
    }
  } catch (ex) {
    result.ex = ex;
  } finally {
    return result;
  }
};

exports.forgetPassword = async (forgetPasswordDTO, result = {}) => {
  try {
    const { email } = forgetPasswordDTO;

    const userExist = await userServices.getUser(email);

    if (!userExist.data) {
      result.userNotFound = true;
    } else {
      const data = await otpServices.createOTP(email, userExist._id);

      if (otpNotUpdated) {
        result.otpNotCreated = true;
      }

      result.data = data;
    }
  } catch (ex) {
    result.ex = ex;
  } finally {
    return result;
  }
};

exports.resetPassword = async (resetPasswordDTO, result = {}) => {
  try {
    const { OTP, email, newPassword } = resetPasswordDTO;

    // Check if user exists
    const userExist = await userServices.getUser(email);
    if (!userExist.data) {
      result.isError = true;
      result.message = "User not found";
    }

    const OTPAvailable = await otpServices.findUser(email);
    if (otpNotFound) {
      result.isError = true;
      result.message = "OTP not found";
    }

    if (OTPAvailable.otp !== OTP || OTPAvailable.expiresAt <= Date.now()) {
      result.isError = true;
      result.message = "Invalid or expired OTP";
    }
    const user = userExist.data;

    // Check if the new password matches the current password
    const isSamePassword = await user.comparePassword(newPassword);
    if (isSamePassword) {
      result.isError = true;
      result.message = "New password cannot be the same as the old password";
    }

    // Check if OTP is valid

    // Update user password
    user.password = newPassword;
    await user.save();

    // Clear OTP data
    OTPAvailable.otp = undefined;
    OTPAvailable.expiresAt = undefined;
    await OTPAvailable.save();

    // Success result

    result.data = { email };
  } catch (ex) {
    // Capture and store any errors
    result.ex = ex;
  } finally {
    // Return the result object regardless of success or error
    return result;
  }
};

exports.logout = async (logoutDto, result = {}) => {
  try {
    const { userId } = logoutDto;

    await redisClient.del(userId.toString());
  } catch (ex) {
    result.ex = ex;x
  } finally {
    return result;
  }
};
