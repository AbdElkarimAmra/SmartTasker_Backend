
const UserModel = require("../user.schema");

async function getUserByEmailProvider(email) {
  if (typeof email !== "string" || !email.trim()) {
    return null;
  }

  const normalizedEmail = email.trim().toLowerCase();

  // If MongoDB fails, let the error propagate
  // to the login provider's catch block.
  const user = await UserModel.findOne({
    email: normalizedEmail
  });

  return user;
}

module.exports = getUserByEmailProvider;
