const createUserProvider = require("./providers/createUser.provider");
const {StatusCodes} = require("http-status-codes");

function handleGetUsers(req, res) {
    res.send("Get users controller")
}

async function handleCreateUsers(req, res) {
    return await createUserProvider(req, res);
}

module.exports = {
    handleGetUsers, handleCreateUsers
}