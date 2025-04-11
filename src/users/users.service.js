const mongoose = require("mongoose");
const User = require("./users.model");

exports.createNewUser = async (createUserDTO, result = {}) => {
  try {

    const newUser = await User.create(createUserDTO);

    if (!newUser) {
      result.newUserNotCreated = true;
    }
    result.data = newUser;
  } catch (ex) {
    result.ex = ex;
  } finally {
    return result;
  }
};

exports.getUsersList = async (getUsersListsDto, result = {}) => {
  try {
    const { limit, offset } = getUsersListsDto;

    const [users, count] = await Promise.all([
      User.find()
        .skip((offset - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 }),
      User.count(),
    ]);
    result.data = {
      users,
      count,
      pages: Math.ceil(count / limit),
    };
  } catch (ex) {
    result.ex = ex;
  } finally {
    return result;
  }
};

exports.userCounts = async (result = {}) => {
  try {
    result.data = await User.count();
  } catch (ex) {
    result.ex = ex;
  } finally {
    return result;
  }
};

exports.getUser = async (findUserDto, result = {}) => {
  try {
    const user = await User.findOne(findUserDto);
    if (!user) {
      return (result.notFound = true);
    }
    result.data = user;
  } catch (ex) {
    result.ex = ex;
  } finally {
    return result;
  }
};

exports.updateContractAddress = async (
  updateContractAddressDTO,
  result = {}
) => {
  try {
    const { user, walletAddress } = updateContractAddressDTO;
    const Address = walletAddress.walletAddress;
    const data = await User.findById(user.id);

    if (data) {
      if (data.walletAddress == null) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: user.id }, // Use _id instead of id unless you have a custom identifier
          { walletAddress: Address }, // Update the wallet address
          { new: true } // Return the updated user document
        );

        result.data = updatedUser;
      } else {
        result.alreadyAvailable = true;
      }
    } else {
      result.userNotFound = true;
    }
  } catch (error) {
    // Handle error, log it for debugging purposes
    console.error("Error updating user wallet address:", error);
    result.error = error.message; // Add error message to result
  } finally {
    return result; // Always return the result, whether successful or not
  }
};
