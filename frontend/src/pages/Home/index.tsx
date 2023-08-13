import { Container } from "@mui/material"
import { useState } from "react"
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { TodoForm } from "../../components/TodoForm";
import { useEffect } from 'react';
import axios from 'axios';
import Cookies from "js-cookie";
import { selectFilter, setTags } from "../../store/filter";
import { useSelector, useDispatch } from "react-redux";
import { 
  selectTodos,
  setTodos,
  setLoading,
  setSelectedTodo
} from '../../store/todos';
import { TodoListHeader } from "../../components/TodoListHeader";
import { TodoList } from "../../components/TodoList";

export default function Home() {
  const filter = useSelector(selectFilter);
  const { todos, selectedTodo, loading } = useSelector(selectTodos);
  const dispatch = useDispatch();
  const [formType, setFormType] = useState<'create' | 'update'>('create');

  useEffect(() => {
    axios.get('http://localhost:8000/todos', {
      headers: {
        'Authorization': `Bearer ${Cookies.get('token')}`
      }
    })
      .then(({ data: { isSucceed, data } }): any => {
        console.log(data);
        const labels = data
          .filter((todo: any) => todo.label && todo.label.title) // Filter out undefined labels
          .map((todo: any) => todo.label.title);
        dispatch(setTags(Array.from(new Set(labels as string[]))));
        dispatch(setTodos(data));
        dispatch(setLoading(false));
        setTodos(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [])

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Container style={{
      width: '700px',
      padding: '0px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      marginTop: '40px'
    }}>
      <TodoListHeader handleOpen={() => {
        setFormType('create')
        handleOpen()
      }} />
      <TodoList handleOpen={() => {
        setFormType('update')
        handleOpen()
      }} />
      <Modal
        open={open}
        onClose={() => {
          dispatch(setSelectedTodo(null))
          handleClose()
        }}
      >
        <Box sx={{
          position: 'absolute' as 'absolute',
          top: '35%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}>
          <TodoForm formType={formType} close={handleClose} />
        </Box>
      </Modal>
    </Container>
  )
}
