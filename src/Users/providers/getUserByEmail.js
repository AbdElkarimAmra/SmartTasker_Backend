const UserModel = require("../user.schema");

async function getUserByEmailProvider(email) {
    try {
        const user = await UserModel.findOne({email: email});
        return user;
    } catch (error) {
        return error;
    }
}

module.exports = getUserByEmailProvider