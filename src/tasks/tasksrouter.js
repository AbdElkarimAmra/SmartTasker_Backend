const express = require("express");
const router = express.Router();
const {body, validationResult} = require("express-validator");
const tasksController = require("./tasks.controller");
const { StatusCodes } = require("http-status-codes");
const req = require("express/lib/request");
const { info } = require("winston");

const createTaskValidator =   require("./validators/createTask.validator");
const getTaskValidator = require("./validators/getTask.validator");
const updateTaskValidator = require("./validators/updateTask.validator");
const deleteTaskValidator = require("./validators/deleteTask.validator");

const authenticateToken = require("../authuntication/../middleware/authenticateToken.middleware");   

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * /tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of tasks needed in a single response.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number of the tasks response.
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           default: 'asc'
 *           enum: [asc, desc]
 *         description: Order of tasks ('asc' or 'desc').
 *     responses:
 *       200:
 *         description: A list of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       401:
 *         description: Not Authorized error
 *         content:
 *           application/json:
 *             example:
 *               error:
 *                 message: "You are not Authorized to perform this request"
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             example:
 *               error:
 *                 message: "Your token is either expired or invalid."
 */
router.get("/tasks", [getTaskValidator, authenticateToken], (req, res) =>{
    const result = validationResult(req);
     if (result.isEmpty()) {
        return tasksController.handleGetTasks(req, res)
    }
    res.status(StatusCodes.BAD_REQUEST).json(result.array());

} );


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * /tasks:
 *   post:
 *     summary: Create a new Task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Task'
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               statusCode: 201
 *               message: Created
 *               data:
 *                 id: 5f9f9f9f9f9f9f9f9f9f9f9f
 *                 title: Task title
 *                 description: Task description
 *                 status: todo
 *                 priority: normal
 *                 dueDate: 2021-01-01
 *                 
 *       401:
 *         description: Not Authorized Error
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               statusCode: 401
 *               message: Unauthorized
 *               error:
 *                 code: 401
 *                 message: You are not authorized to access this resource. Please log in
           
 *       403:
 *         description: Forbidden Error
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               statusCode: 401
 *               message: Forbidden
 *               error:
 *                 code: 401
 *                 message: Please log in again. Invalid token
 *    
 */
router.post("/tasks", [createTaskValidator, authenticateToken], (req, res) => {
    const result = validationResult(req);
    //console.log(result);
    //is empty checks if the errors array is empty or not
    if (result.isEmpty()) {
        return tasksController.handlePostTasks(req, res)
    }
    res.status(StatusCodes.BAD_REQUEST).json(result.array());
}
);

/**
 * @swagger
 *
 * components:
 *  securitySchemes:
 *    bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 * /tasks:
 *  delete:
 *    summary: Delete a task
 *    tags: [Tasks]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/TaskDelete'
 *    responses:
 *      200:
 *        description: Task deleted successfully
 *        content:
 *          application/json:
 *            example:
 *              status: success
 *              statusCode: 200
 *              message: Ok
 *              data:
 *                acknowledged: true
 *                deletedCount: 1
 *
 *      401:
 *        description: Not Authorized Error
 *        content:
 *          application/json:
 *            example:
 *              status: error
 *              statusCode: 401
 *              message: Unauthorized
 *              error:
 *                message: You are not authorised to perform this request
 *      403:
 *        description: Forbidden Error
 *        content:
 *          application/json:
 *            example:
 *              status: error
 *              statusCode: 403
 *              message: Forbidden
 *              error:
 *                message: Please login again, invalid token.
 */
router.delete("/tasks", [deleteTaskValidator, authenticateToken], (req, res) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        return tasksController.handleDeleteTasks(req, res)
    }
    res.status(StatusCodes.BAD_REQUEST).json(result.array());
});


/**
 * @swagger
 *
 * components:
 *  securitySchemes:
 *    bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 * /tasks:
 *  patch:
 *    summary: Update a task
 *    tags: [Tasks]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/TaskUpdate'
 *    responses:
 *      200:
 *        description: Task updated successfully
 *        content:
 *          application/json:
 *            example:
 *              status: success
 *              statusCode: 200
 *              message: Ok
 *              data:
 *                _id: 673de6c779952edf27e811fa
 *                title: Create a new video
 *                description: A video about fullstack web development
 *                status: todo
 *                priority: normal
 *                dueDate: 2025-01-01T12:00:00Z
 *
 *      401:
 *        description: Not Authorized Error
 *        content:
 *          application/json:
 *            example:
 *              status: error
 *              statusCode: 401
 *              message: Unauthorized
 *              error:
 *                message: You are not authorised to perform this request
 *      403:
 *        description: Forbidden Error
 *        content:
 *          application/json:
 *            example:
 *              status: error
 *              statusCode: 403
 *              message: Forbidden
 *              error:
 *                message: Please login again, invalid token.
 */
router.patch("/tasks", [updateTaskValidator, authenticateToken], (req, res)=> {
    const result = validationResult(req);
    if (result.isEmpty()) {
        return tasksController.handlePatchTasks(req, res)
    }
    res.status(StatusCodes.BAD_REQUEST).json(result.array());
} );

module.exports = router;