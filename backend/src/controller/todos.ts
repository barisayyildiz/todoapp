import dotenv from "dotenv"
import { Request } from "../types";
import { Response } from "express";
import { PrismaClient } from '@prisma/client'
import type { Todo } from "@prisma/client";
import type { BaseResponseType, TodoIncludedFiles } from "../types";

dotenv.config()
const prisma = new PrismaClient()

export const getUserTodos = async (req: Request, res: Response<BaseResponseType<Todo[]>>) => {
  const todos = await prisma.todo.findMany({
    where: {
      userId: Number(req.user?.id)
    },
    include: {
      files: true,
      label: true,
    },
    orderBy: {
      updatedAt: 'desc'
    }
  })
  res.json({
    isSucceed: true,
    data: todos,
    message: null
  });
}

export const getSingleTodo = async (req: Request, res: Response<BaseResponseType<TodoIncludedFiles>>) => {
  const { id } = req.params;
  try {
    const todo = await prisma.todo.findUnique({
      where:{
        id: Number(id),
        userId: req.user?.id
      },
      include: {
        files: true,
        label: true
      }
    })
    if (!todo) {
      res.status(404).json({
        isSucceed: false,
        data: null,
        message: 'User not found'
      })
    }
    res.json({
      isSucceed: true,
      data: todo as TodoIncludedFiles,
      message: null
    })
  } catch (error) {
    res.json({
      isSucceed: false,
      data: null,
      message: error as string
    })
  }
}


export const deleteTodo = async (req: Request, res: Response<BaseResponseType<Todo>>) => {
  const { id } = req.params;
  try {
    const todo = await prisma.todo.delete({
      where:{
        id: Number(id)
      }
    })
    if(!todo) {
      return res.status(404).json({
        isSucceed: false,
        data: null,
        message: 'User not found'
      })
    } 
    res.status(200).json({
      isSucceed: true,
      data: todo,
      message: null
    })
  } catch(error) {
    res.status(404).json({
      isSucceed: false,
      data: null,
      message: error as string
    })
  }
}


export const createTodo = async (req: Request, res: Response<BaseResponseType<TodoIncludedFiles>>) => {
  const { description, labelName } = req.body;

  if(!description) {
    res.status(400).json({
      isSucceed: false,
      data: null,
      message: 'Description can not be empty'
    })
  }
  
  const userId = req.user?.id;
  if (userId === undefined) {
    res.status(500).json({
      isSucceed: false,
      data: null,
      message: 'User ID not available'
    });
    return;
  }

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const file = files['file'] ? files['file'][0] : null;
  const thumbnail = files['thumbnail'] ? files['thumbnail'][0] : null;
  const filesToCreate = [file, thumbnail].filter(Boolean);

  try {
    let label;
    if (labelName) {
      label = await prisma.label.upsert({
        where: { title: labelName },
        create: { title: labelName },
        update: {},
      });
    }

    const todo = await prisma.todo.create({
      data: {
        description,
        userId,
        labelId: label?.id,
        files: {
          create: filesToCreate.map((file: any) => ({
            name: file.originalname,
            data: file.buffer,
            fileType: file.mimetype,
            thumbnail: file.fieldname === 'thumbnail',
          })),
        },
      },
      include:{
        files: true,
        label: true
      }
    });
  
    res.status(201).json({
      isSucceed: true,
      data: todo as TodoIncludedFiles,
      message: null
    });
  } catch (error) {
    res.status(500).json({
      isSucceed: false,
      data: null,
      message: error as string
    });
  }
}

export const updateTodo = async (req: Request, res: Response<BaseResponseType<TodoIncludedFiles>>) => {
  const todoId = parseInt(req.params.id);
  const { description } = req.body;

  if (!description) {
    res.status(400).json({
      isSucceed: false,
      data: null,
      message: 'Description cannot be empty'
    });
    return;
  }

  const userId = req.user?.id;
  if (userId === undefined) {
    res.status(500).json({
      isSucceed: false,
      data: null,
      message: 'User ID not available'
    });
    return;
  }

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const file = files['file'] ? files['file'][0] : null;
  const thumbnail = files['thumbnail'] ? files['thumbnail'][0] : null;
  const filesToCreate = [file, thumbnail].filter(Boolean);

  try {
    await prisma.todo.update({
      where: {
        id: todoId,
        userId: userId,
      },
      data: {
        description,
      },
      include: {
        files: true,
      },
    });

    const fileOld = await prisma.file.findFirst({
      where: {
        thumbnail: false,
        todoId: todoId
      }
    })

    const thumbnailOld = await prisma.file.findFirst({
      where: {
        thumbnail: true,
        todoId: todoId
      }
    })

    if(file) {
      await prisma.file.upsert({
        where: {
          id: fileOld ? fileOld.id : -1,
        },
        create: {
          todoId: todoId,
          name: file.originalname,
          data: file.buffer,
          fileType: file.mimetype,
          thumbnail: false,
        },
        update: {
          name: file.originalname,
          data: file.buffer,
          fileType: file.mimetype,
        },
      });
    }

    if(thumbnail) {
      await prisma.file.upsert({
        where: {
          id: thumbnailOld ? thumbnailOld.id : -1,
        },
        create: {
          todoId: todoId,
          name: thumbnail.originalname,
          data: thumbnail.buffer,
          fileType: thumbnail.mimetype,
          thumbnail: true,
        },
        update: {
          name: thumbnail.originalname,
          data: thumbnail.buffer,
          fileType: thumbnail.mimetype,
        },
      });
    }

    const todo = await prisma.todo.findUnique({
      where: {
        id: todoId
      },
      include:{
        files: true,
        label: true
      }
    });

    res.status(200).json({
      isSucceed: true,
      data: todo as TodoIncludedFiles,
      message: null
    });

  } catch (error) {
    res.status(500).json({
      isSucceed: false,
      data: null,
      message: error as string
    });
  }
}
