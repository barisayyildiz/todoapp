import type { Request as ExpressRequest } from "express"
import type { User, Todo, File } from "@prisma/client"

export type AuthenticatedUser = Omit<User, 'password'>;
export interface Request extends ExpressRequest {
  user?: AuthenticatedUser
}

type SuccessResponseType<T> = {
  isSucceed: true,
  data: T,
  message: null
}

type FailResponseType = {
  isSucceed: false,
  data: null,
  message: string
}

export type BaseResponseType<T> = 
  SuccessResponseType<T> | FailResponseType;

export type LoginResponse = {
  token: string
}

export type TodoIncludedFiles = Todo & {
  files: File[]
}
