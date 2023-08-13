import { InputHTMLAttributes } from 'react';

export type TodoItemType = {
  id: number;
  description: string;
  userId: number;
  labelId: number | null;
  label: LabelType | null;
  files: FileType[];
  createdAt: string;
  updatedAt: string;
}

export type FileType = {
  id: number,
  name: string,
  data: {
    type: string;
    data: number[]
  },
  fileType: string;
  thumbnail: boolean;
}

export type LabelType = {
  id: number;
  title: string;
}

export type FilterType = {
  query: string, 
  tags: string[],
  selectedTags: string[]
}

export type TodoFormPropType = {
  close: Function,
  formType: 'create' | 'update';
}

export interface InputFileProps extends InputHTMLAttributes<HTMLInputElement> {
  allowedFileExtensions: string[],
  imageInput?: boolean
}

export type TodoListProps = {
  handleOpen: any
}

export type TodoListHeaderProps = {
  handleOpen: any
}
