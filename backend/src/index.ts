import dotenv from "dotenv"
import express from 'express'
import cors from 'cors';
import { isAuth } from './utils';
import AuthRouter from './routes/auth'
import TodosRouter from './routes/todos'
import UserRouter from './routes/user'

dotenv.config()
const app = express()

app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL
  credentials: true, // Allow cookies and headers
}));

app.use(express.json())
app.use("/", AuthRouter)
app.use("/user", UserRouter)
app.use("/todos", isAuth, TodosRouter)

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server ready at: http://localhost:${PORT}`))
