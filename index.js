import express from "express";
import bodyPaser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./database/db.js";
import Todo from "./model/todo.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

app.use(express.json());
app.use(bodyPaser.json());
app.use(bodyPaser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

//get all todos
app.get("/todos", async (req, res) => {
  const todos=await Todo.find();
  res.json(todos);
});

//add a new todo

app.post("/add-todo", async(req, res) => {
  const newTask = req.body.task;
  console.log(newTask);
  if (newTask && newTask.trim() !== "") {
    const newTodo=await Todo.create({task:newTask.trim(),isDone:false});
    console.log(newTodo);
    res.status(201).json(newTodo);
  } else {
    res.status(400).json({ message: "Task cannot be empty" });
  }
});

//update a todo

app.put("/update-todo/:id", async(req, res) => {
  
  try{
    const id=req.params.id;
    console.log(id);
    const {task,isDone}=req.body;

    const updateFields={};
    if(task!==undefined) updateFields.task=task;
    if(isDone!==undefined) updateFields.isDone=isDone;

    const result=await Todo.updateOne({_id:id},{$set:updateFields});

    if(result.modifiedCount>0){
      res.json({success:true, message:"Todo updated successfully"})
    }else{
      res.status(404).json({success:false,message:"Todo not found"})
    }

  }catch(error){
    console.error("Error updating todo:",error);
    res.status(500).json({success:false,message:"Server error"})

  }



  
});

// delete a todo
app.delete("/delete-todo/:id", async (req, res) => {
  const id = req.params.id;
  await Todo.deleteOne({ _id: id });
  res.json({ success: true });
});


connectDB().then(()=>{
  app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
});

