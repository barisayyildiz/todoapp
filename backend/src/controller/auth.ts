import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import { Request } from "express";
import { Response } from "express";
import { hashPassword, excludeKey } from "../utils";
import { PrismaClient } from '@prisma/client'
import bcrypt from "bcrypt"
import type { BaseResponseType, AuthenticatedUser, LoginResponse } from "../types";

dotenv.config()
const prisma = new PrismaClient()

export const handleRegister = async (req: Request, res: Response<BaseResponseType<AuthenticatedUser>>) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await hashPassword(password);
    const result = await prisma.user.create({
      data: {
        username,
        password: hashedPassword as string,
      },
    })
    res.json({
      isSucceed: true,
      data: excludeKey(result, 'password') as AuthenticatedUser,
      message: null
    })
  } catch (error) {
    res.status(400).json({
      isSucceed: false,
      data: null,
      message: error as string
    })
  }
}

export const handleLogin = async (req: Request, res: Response<BaseResponseType<LoginResponse>>) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where:{
        username
      }
    })

    if (!user) {
      return res.status(401).json({
        isSucceed: false,
        data: null,
        message: 'Username not found'
      })
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ 
        isSucceed: false,
        data: null,
        message: 'Password is invalid'
      });
    }

    const token = jwt.sign({ username: user.username, id: user.id }, 
      process.env.SECRET_KEY as string, { expiresIn: '7d' });
      
    res.cookie('token', token);
    return res.json({
      isSucceed: true,
      data: {
        token,
      },
      message: null
    })
  } catch (error) {
    res.status(400).json({
      isSucceed: false,
      data: null,
      message: error as string
    })
  }
}
