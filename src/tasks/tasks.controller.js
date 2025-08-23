


const {StatusCodes} = require("http-status-codes");
const Task = require("./task.schema");
const createTaskProvider = require("./providers/createTask.provider");
const getTasksProvider = require("./providers/getTasks.provider");
const updateTaskProvider = require("./providers/updateTask.provider");
const deleteTaskProvider = require("./providers/deleteTaskProvider");


async function handleGetTasks(req, res) { 
  return await getTasksProvider(req, res);
}

async function handlePostTasks(req, res, next) {
    return await createTaskProvider(req, res);
}
async function handleDeleteTasks(req, res) {
    return await deleteTaskProvider(req, res);
    
}
async function handlePatchTasks(req, res) {
    return await updateTaskProvider(req, res);
}

module.exports = {
handleGetTasks, handlePostTasks, handleDeleteTasks, handlePatchTasks
}
