const express = require("express");
const authenticate = require("../middleware/auth.middleware");
const TodoModel = require("../models/todo.model");

const router = express.Router();

// Create Todo → POST /todos
router.post("/", authenticate, async (req, res) => {
  try {
    let { title, description } = req.body;

    if (!title || !description) {
      res.status(400).json({ error: "Title or Description missing" });
    }

    let todo = await TodoModel.create({ title, description, createdBy: req.user.id });

    res.status(201).json({ msg: "Todo created successfully", todo });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Something went wrong, please try again later" });
  }
});

// Read Todos → GET /todos
router.get('/', authenticate, async(req, res) => {
    try {
        let userId = req.user.id;

        let todos = await TodoModel.find({createdBy: userId});
        if(!todos || todos.length === 0){
            res.status(404).json({error: "No todo found"})
        }

        res.status(200).json({todos});
    } catch (error) {
         console.log(error);
         res
           .status(500)
           .json({ error: "Something went wrong, please try again later" });
    }
});

// Update Todo → PUT /todos/:id
router.put('/:id', authenticate, async(req, res) => {
    try {
        let {id} = req.params;
        let {title, description, status} = req.body;

        let authenticatedId = req.user.id;
        let todo = await TodoModel.findById(id);

        if (!todo) {
          return res.status(404).json({ error: "Todo not found" });
        }

        if(authenticatedId === todo.createdBy.toString()){
            let updatedTodo = await TodoModel.findByIdAndUpdate(
              id,
              { title, description, status },
              { new: true }
            );
            res.json({msg: "Todo updated successfully", updatedTodo});
        }else{
            return res.status(403).json({error: "Now allowed"});
        }
    } catch (error) {
         console.log(error);
         res
           .status(500)
           .json({ error: "Something went wrong, please try again later" });
    }
})


// Delete Todo → DELETE /todos/:id
router.delete("/:id", authenticate, async (req, res) => {
  try {
    let { id } = req.params;

    let authenticatedId = req.user.id;
    let todo = await TodoModel.findById({ _id: id });

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    if (authenticatedId === todo.createdBy.toString()) {
      await TodoModel.findByIdAndDelete(id);
      res.json({ msg: "Todo Deleted successfully"});
    } else {
      return res.status(403).json({ error: "Now allowed" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Something went wrong, please try again later" });
  }
});

module.exports = router;
