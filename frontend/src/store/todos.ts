import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { TodoItemType } from "../types";
import type { AppState } from ".";

type TodoStateType = {
  todos: TodoItemType[],
  selectedTodo: number | null,
  loading: boolean
};

const initialState: TodoStateType = {
  todos: [],
  selectedTodo: null,
  loading: true,
};

const todos = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setTodos: (state, action: PayloadAction<TodoItemType[]>) => {
      state.todos = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    addTodo: (state, action: PayloadAction<TodoItemType>) => {
      state.todos = [action.payload, ...state.todos];
    },
    updateTodo: (state, action: PayloadAction<TodoItemType>) => {
      const index = state.todos.findIndex(todo => todo.id === action.payload.id);
      state.todos[index] = action.payload;
    },
    deleteTodo: (state, action: PayloadAction<number>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload)
    },
    setSelectedTodo: (state, action: PayloadAction<number | null>) => {
      state.selectedTodo = action.payload
    }
  }
});

export const selectTodos = (state: AppState) => state.todos;
export const { setTodos, setLoading, addTodo, updateTodo, deleteTodo, setSelectedTodo } = todos.actions;
export default todos.reducer;
