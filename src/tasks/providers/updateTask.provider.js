const { matchedData } = require("express-validator");
const Task = require("../task.schema");
const errorLogger = require("../../helpers/errorLogger");


async function updateTaskProvider(req, res){

    const validatedData = matchedData(req);
    console.log(typeof(validatedData));


    try {
        const task = await Task.findById(validatedData["_id"]);
        
        task.title = validatedData.title || task.title;
        task.description = validatedData.description  || task.description; ;
        task.priority = validatedData.priority || task.priority;
        task.status = validatedData.status || task.status;
        task.dueDate = validatedData.dueDate   || task.dueDate;
        return await task.save();
    } catch (error) {
        errorLogger(`Error creating a new task: ${error.message}`, req, error);
        return res.status(StatusCodes.GATEWAY_TIMEOUT).json(
            {reason: "unable to process ur request at the moment"}
        )
    }
}


module.exports = updateTaskProvider