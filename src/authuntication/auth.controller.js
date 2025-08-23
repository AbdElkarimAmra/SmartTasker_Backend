const loginProvider = require("./validators/providers/login.provider");

async function handleLogin(req, res) {
    return await loginProvider(req, res);
}

module.exports = {
    handleLogin
}