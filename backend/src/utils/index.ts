import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt';
import { Response, NextFunction } from "express";
import { AuthenticatedUser, Request } from "../types";
dotenv.config()

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
    
  if(!token) {
    throw new Error();
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY as string);
    req.user = decoded as AuthenticatedUser;
    next();
  } catch (error) {
    return res.status(401).json({
      isSucceed: false,
      data: null,
      message: 'Invalid token'
    })
  }
}

export const hashPassword = async (password: string, saltRounds = 10) => {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    return hashedPassword
  } catch (error) {
    throw error;
  }
}

export const excludeKey = <T>(data: T, key: keyof T): Omit<T, typeof key> => {
  const excluded = (({ [key]: _, ...rest }) => rest)(data);
  return excluded;
}

