import express from "express";
import auth from "../middleware/auth.js";
import {
    getTasks, getInternTasks, createTask, updateTask, deleteTask
} from "../controllers/taskController.js";

const router = express.Router();

router.get("/",                         auth, getTasks);
router.get("/intern/:internId",         auth, getInternTasks);
router.post("/",                        auth, createTask);
router.put("/:id",                      auth, updateTask);
router.delete("/:id",                   auth, deleteTask);

export default router;
