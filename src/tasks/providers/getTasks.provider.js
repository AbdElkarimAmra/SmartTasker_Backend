const Task = require("../task.schema");
const {matchedData} = require("express-validator")
const {StatusCodes} = require("http-status-codes");
const errorLogger = require("../../helpers/errorLogger");
const { link } = require("../tasksrouter");
async function getTasksProvider(req, res) {
    const query = matchedData(req);
    console.log(query);
    
    try {
        const totalTasks = await Task.countDocuments();
        const currentPage = query.page;
        const limit = query.limit;
        const order = query.order;
        const totalPages = Math.ceil(totalTasks / limit);
        const nextPage = currentPage === totalPages ? currentPage : currentPage + 1;
        const prevPage = currentPage === 1 ? currentPage : currentPage - 1;
        const baseUrl = `${req.protocol}://${req.get("host")}${req.originalUrl.split("?")[0]}`;
        const tasks = await Task.find(
            {status: {$in:["todo", "inProgress"]}},
        ).limit(limit).skip(currentPage -1).sort({createdAt: order === "asc" ? 1 : -1});

        let finalResponse = {
            data: tasks,
            pagination: {
                itemsPerPage: limit,
                totalItems: totalTasks,
                currentPage: currentPage,
                totalPages: totalPages,
            },
            links: {
                first: `${baseUrl}/?limit=${limit}&page=1&order=${order}`,
                prev: `${baseUrl}/?limit=${limit}&page=${prevPage}&order=${order}`,
                next: `${baseUrl}/?limit=${limit}&page=${nextPage}&order=${order}`,
                last: `${baseUrl}/?limit=${limit}&page=${totalPages}&order=${order}`
            }

        }
        return res.status(StatusCodes.OK).json(finalResponse);
    } catch (error) {
        errorLogger("Error while fetchig tasks", req, error);
        return res.status(StatusCodes.GATEWAY_TIMEOUT).json(
            {reason: "unable to process ur request at the moment"}
        )
    }
}

module.exports = getTasksProvider;