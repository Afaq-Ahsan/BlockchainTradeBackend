const userService = require("../users/users.service");

exports.getDashboardStats = async (result = {}) => {
  try {
    const [users] = await Promise.all([
      // const [users, collections, users] = await Promise.all([
      await userService.userCounts(),
      // await launchpadsService.launchpadCounts(),
      // await usersService.usersCount()
    ]);

    result.data = {
      users: users?.data,
      // collections: collections?.data,
      // creators: creators?.data,
      // users: users?.data
    };
  } catch (ex) {
    result.ex = ex;
  } finally {
    return result;
  }
};
