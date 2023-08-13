import { Box } from "@mui/material"
import { Button } from "@mui/material"
import axios from "axios";
import Cookies from "js-cookie";
import type { TodoItemType } from "../../types";
import { selectTodos, deleteTodo } from "../../store/todos";
import { useDispatch, useSelector } from "react-redux";
import { getImagePreview } from "../../utils";
import { useMemo } from 'react';

type TodoItemProps = TodoItemType & {
  onClick: any;
}

export const TodoItem = (props: TodoItemProps) => {
  const { onClick } = props;
  const { todos, selectedTodo, loading } = useSelector(selectTodos);
  const dispatch = useDispatch();

  const [thumbnailData, thumbnailType] = useMemo(() => {
    const imageFile = props.files.find(file => file.thumbnail === true);
    if (imageFile) {
      return [imageFile.data.data, imageFile.fileType];
    }
    return [null, null];
  }, [props.files]);

  const handleDelete = (event: any) => {
    event.stopPropagation();
    const { id } = props;

    axios.delete(`http://localhost:8000/todos/${id}`, {
      headers: {
        'Authorization': `Bearer ${Cookies.get('token')}`,
      }
    })
    .then(res => {
      dispatch(deleteTodo(id));
    });
  }
  return(
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px',
      cursor: 'pointer',
      border: '1px solid #c5c5c5'
    }}
      onClick={onClick}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <Box
          component="img"
          sx={{
            height: 80,
            width: 80,
            maxHeight: { xs: 250, md: 250 },
            maxWidth: { xs: 250, md: 250 },
            borderRadius: '100%'
          }}
          src={(thumbnailData && thumbnailType) ? getImagePreview(thumbnailData, thumbnailType) : 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/681px-Placeholder_view_vector.svg.png'}
        />
        <p className="text-xl">{props.description}</p>
      </div>
      <Button onClick={handleDelete} variant="contained" color="error">
        Delete
      </Button>
    </div>
  )
}

