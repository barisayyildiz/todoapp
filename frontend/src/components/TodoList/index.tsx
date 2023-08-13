import { TodoItem } from "../TodoItem"
import type { TodoItemType, FilterType, TodoListProps } from "../../types";
import { useSelector, useDispatch } from 'react-redux';
import { Box } from "@mui/material";
import {  selectTodos, setSelectedTodo } from "../../store/todos";
import { selectFilter } from "../../store/filter";

const filterBy = (data: TodoItemType[], filter: FilterType) => {  
  let filtered = data.filter(item => item.description.includes(filter.query))
  if(filter.selectedTags?.length) {
    filtered = filtered.filter(item => {
      if (!item.label) {
        return false;
      }
      return filter.selectedTags?.indexOf(item.label.title as string) !== -1
    })
  }
  console.log(filtered)
  return filtered;
}

export function TodoList(props: TodoListProps) {
  const { handleOpen } = props;
  const dispatch =  useDispatch();
  const { todos } = useSelector(selectTodos);
  const filter = useSelector(selectFilter);

  return (
    <Box style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      width: '100%'
    }}>
      {
        filterBy(todos, filter as FilterType).map((todo, index) => (
          <TodoItem 
            {...todo}
            key={index}
            onClick={() => {
              dispatch(setSelectedTodo(todo.id))
              handleOpen()
            }}
          />
        ))
      }
    </Box>
  );
}


