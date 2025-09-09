const express = require("express");
const authenticate = require("../middleware/auth.middleware");
const TodoModel = require("../models/todo.model");

const router = express.Router();

// Create Todo → POST /todos
router.post("/", authenticate, async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: "Title or Description missing" });
    }

    const todo = await TodoModel.create({
      title,
      description,
      createdBy: req.user.id,
    });
    res.status(201).json({ msg: "Todo created successfully", todo });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Something went wrong, please try again later" });
  }
});

// Read Todos → GET /todos
router.get("/", authenticate, async (req, res) => {
  try {
    const todos = await TodoModel.find({ createdBy: req.user.id });
    if (!todos.length) return res.status(404).json({ error: "No todo found" });

    res.status(200).json({ todos });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Something went wrong, please try again later" });
  }
});

// Update Todo → PUT /todos/:id
router.put("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const todo = await TodoModel.findById(id);
    if (!todo) return res.status(404).json({ error: "Todo not found" });

    if (req.user.id !== todo.createdBy.toString()) {
      return res.status(403).json({ error: "Not allowed" });
    }

    const updatedTodo = await TodoModel.findByIdAndUpdate(
      id,
      { title, description, status },
      { new: true }
    );
    res.json({ msg: "Todo updated successfully", updatedTodo });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Something went wrong, please try again later" });
  }
});

// Delete Todo → DELETE /todos/:id
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await TodoModel.findById(id);
    if (!todo) return res.status(404).json({ error: "Todo not found" });

    if (req.user.id !== todo.createdBy.toString()) {
      return res.status(403).json({ error: "Not allowed" });
    }

    await TodoModel.findByIdAndDelete(id);
    res.json({ msg: "Todo Deleted successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Something went wrong, please try again later" });
  }
});

module.exports = router;