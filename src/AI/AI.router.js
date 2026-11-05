const express = require("express");
const getFocusPicks = require("./focus");
const Task = require("../tasks/task.schema.js");
const createTaskFromDescription = require("./createTaskFromDescription");

const router = express.Router();

router.post("/aiCreateTask", async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.sub || req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: missing user" });
    }

    console.log("req.body =", req.body);
    console.log("req.body.description =", req.body?.description);
    console.log("typeof req.body.description =", typeof req.body?.description);

    const description = req.body?.description;

    if (typeof description !== "string" || !description.trim()) {
      return res.status(400).json({
        error: "Description must be a non-empty string",
      });
    }

    const aiTask = await createTaskFromDescription(description.trim());

    const newTask = await Task.create({
      user: userId,
      title: aiTask.title,
      description: aiTask.description,
      status: aiTask.status || "todo",
      priority: aiTask.priority || "normal",
      dueDate: aiTask.dueDate ? new Date(aiTask.dueDate) : null,
    });

    return res.status(201).send({
      message: "AI task created successfully",
      data: newTask,
    });
  } catch (err) {
    console.log("AI CREATE TASK ERROR:", err);
    return res.status(500).send({ error: err.message });
  }
});

module.exports = router;