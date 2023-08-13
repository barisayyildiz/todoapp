import express from "express";
import { 
  createTodo, 
  deleteTodo, 
  getSingleTodo, 
  getUserTodos, 
  updateTodo 
} from "../controller/todos";
import multer from 'multer';

const upload = multer();
const router = express.Router()

router.get("/", getUserTodos)
router.get("/:id", getSingleTodo)
router.post("/", upload.fields([{ name: 'file', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), createTodo)
router.put("/:id", upload.fields([{ name: 'file', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), updateTodo)
router.delete("/:id", deleteTodo)

export default router

