const Task = require("../task.schema");
const {matchedData, body} = require("express-validator");
const {StatusCodes} = require("http-status-codes");


const errorLogger = require("../../helpers/errorLogger")
async function createTaskProvider(req, res) {
    // here we are not taking care of the validation. all the fields (including extra fields) are saved. we need to sanitize them before adding them to DB
    const validatedData = matchedData(req);
    console.log(validatedData);
    const task = new Task({...validatedData, user: req.user.sub});
    
    //check if the authenitcation(verifying the toke) works when sending task requests
    console.log(req.user);
    try {
      await task.save();
      // console.log("Task", task);
      // console.log("______________________________________________________________________________________________")
      return res.status(StatusCodes.CREATED).json(task); // this means the task is saved and returned to the clone in JSON
    } catch (error) {
      errorLogger(`Error creating a new task: ${error.message}`, req, error);
      return res.status(StatusCodes.GATEWAY_TIMEOUT).json({reason: "Unable to process the request at the moment. Please try again later."});
    }
}


// async function createTaskProvider(data, deps = { Task }) {
//   const { title, description, priority, status, dueDate } = data;

//   const task = deps.Task.create({ title, description, priority, status, dueDate });
//   return await task.save(); // (optionally: return (await task.save()).toObject())
// }

module.exports = createTaskProvider