const errorLogger = require("../../helpers/errorLogger");
const Task = require("../task.schema")
const {StatusCodes} = require("http-status-codes");
const {matchedData} = require("express-validator");

async function  deleteTaskProvider(req, res) {
    const validatedData = matchedData(req);

    try {
        const deletedTask = await Task.deleteOne({_id: validatedData["_id"]});
        return res.status(StatusCodes.OK).json(deletedTask);
    } catch (error) {
        errorLogger("Error while deleting tasks", req, error);
        return res.status(StatusCodes.GATEWAY_TIMEOUT).json(
            {reason: "unable to process ur request at the moment"}
        )
    }
}  

module.exports = deleteTaskProvider