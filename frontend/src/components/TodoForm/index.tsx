import { useState } from 'react';
import { Typography, TextField, Button, MenuItem, Select } from '@mui/material';
import { InputFile } from '../InputFile';
import { SelectChangeEvent } from '@mui/material/Select';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useEffect, useRef } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import type { TodoFormPropType } from '../../types';
import { getImagePreview } from '../../utils';
import { useSelector, useDispatch } from 'react-redux';
import { addTodo, updateTodo, selectTodos } from '../../store/todos';
import { selectFilter } from '../../store/filter';

export function TodoForm({ close, formType }: TodoFormPropType) {
  const { todos, loading, selectedTodo } = useSelector(selectTodos);
  const filter = useSelector(selectFilter);
  const dispatch = useDispatch();

  const [selectedTag, setSelectedTag] = useState<string>('');

  const fileRef = useRef<HTMLInputElement | null>(null);
  const thumbnailRef = useRef<HTMLInputElement | null>(null);

  // file datas
  const [fileData, setFileData] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [thumbnailData, setThumbnailData] = useState<ArrayBufferLike | null>(null);
  const [thumbnailType, setThumbnailType] = useState<string>('');

  const handleDownloadFile = () => {
    if (fileData && fileName) {
      const blob = new Blob([fileData]);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
    }
  };

  useEffect(() => {
    if (selectedTodo) {
      // get single todo
      axios.get(`http://localhost:8000/todos/${selectedTodo}`, {
        headers: {
          'Authorization': `Bearer ${Cookies.get('token')}`,
        }
      })
      .then(({ data : response }: any) => {
        const { files } = response.data;

        setSelectedTag(response.data.label?.title);

        files.forEach((file: any) => {
          if(file.thumbnail) {
            setThumbnailData(file.data.data);
            setThumbnailType(file.fileType);
          } else {
            setFileData(file.data.data);
            setFileName(file.name);
          }
        });
      })
    }
  }, [selectedTodo])

  const createTodo = (formData: FormData) => {
    axios.post('http://localhost:8000/todos', formData, {
      headers: {
        'Authorization': `Bearer ${Cookies.get('token')}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(res => {
      dispatch(addTodo(res.data.data));
      close();
    })
    .catch(error => console.error('Error:', error));
  }

  const updateTodo = (formData: FormData) => {
    axios.put(`http://localhost:8000/todos/${selectedTodo}`, formData, {
      headers: {
        'Authorization': `Bearer ${Cookies.get('token')}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(res => {
      console.log(res.data.data);
      // dispatch(updateTodo(res.data.data));
      close();
    })
    .catch(error => console.error('Error:', error));
  }


  const handleSubmit = (event: any) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('labelName', event.target.labelName.value);
    formData.append('description', event.target.description.value);
    if (event.target.file) {
      formData.append('file', event.target.file.files[0]);
    }
    if (event.target.thumbnail) {
      formData.append('thumbnail', event.target.thumbnail.files[0]);
    }
    
    if (formType === 'create') {
      createTodo(formData);
    } else {
      updateTodo(formData)
    }
  };

  const handleChange = (event: SelectChangeEvent<typeof selectedTag>) => {
    const {
      target: { value },
    } = event;
    setSelectedTag(value as string);
  };

  let description = '';
  if (todos) {
    description = todos.find(todo => todo.id === selectedTodo)?.description as string;
  }

  return (
      <>
      <Typography style={{textAlign:'center', margin: '10px 0px'}} id="modal-modal-title" variant="h4" component="h4">
        {
          formType==='create' ? 'Create Todo' : 'Update Todo'
        }
      </Typography>
      <form style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }} onSubmit={handleSubmit}>
        {
          thumbnailData ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <img style={{
                width: '200px',
              }} src={getImagePreview(thumbnailData, thumbnailType)} />
              <a style={{
                cursor: 'pointer'
              }} onClick={() => setThumbnailData(null)}>
                <DeleteIcon />
              </a>
            </div>
          ) : (
            <InputFile 
              ref={thumbnailRef}
              imageInput
              id="thumbnail" 
              name="thumbnail" 
              allowedFileExtensions={['.png']} 
            />
          )
        }
        {
          fileData ? (
            <div style={{
              display:'flex',
              flexDirection: 'column'
            }}>
              <Button onClick={handleDownloadFile}>Download File</Button>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '20px'
              }}>
                {fileName && (
                  <p>{fileName}</p>
                )}
                <a onClick={() => setFileData(null)}>
                  <DeleteIcon />
                </a>
              </div>
            </div> 
          ) : (
            <InputFile 
              ref={fileRef}
              id="file" 
              name="file" 
              allowedFileExtensions={['.pdf', '.doc', '.docx', '.png', '.txt']} 
            />
          )
        }
        <Select
          value={selectedTag}
          onChange={handleChange}
          label="Tag"
          name="labelName"
        >
          {
            Array.from(filter.tags).map((tag, index) => (
              <MenuItem key={index} value={tag}>{tag}</MenuItem>
            ))
          }
        </Select>
        <TextField name='description' defaultValue={selectedTodo ? description : ''} label="Description" variant="outlined" />
        <Button variant='contained' type="submit" style={{ marginTop: '20px' }}>
          Submit
        </Button>
      </form>
    </>
  );
}
