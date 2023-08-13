import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import { Request } from "express";
import { Response } from "express";
import { PrismaClient } from '@prisma/client';
import type { BaseResponseType, AuthenticatedUser } from "../types";

dotenv.config()
const prisma = new PrismaClient()

export const getUser = async (req: Request, res: Response<BaseResponseType<AuthenticatedUser>>) => {
  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, process.env.SECRET_KEY as string);
    res.json({
      isSucceed: true,
      data: decoded as AuthenticatedUser,
      message: null
    });
  } catch (error) {
    res.status(400).json({
      isSucceed: false,
      data: null,
      message: error as string
    })
  }
}
