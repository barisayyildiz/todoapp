import express from "express";
import { getUser } from "../controller/user";

const router = express.Router()

router.post('/', getUser)

export default router
