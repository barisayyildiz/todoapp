import { useState } from 'react';
import { Typography, Container } from '@mui/material';
import { InputHTMLAttributes, forwardRef, ForwardedRef, Ref } from 'react';
import { Alert } from "@mui/material";
import { InputFileProps } from '../../types';

export const InputFile = forwardRef((props: InputFileProps, ref: ForwardedRef<HTMLInputElement>) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');

  const handleDragOver = (event: any) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (event: any) => {
    event.preventDefault();
    setDragging(false);
    const droppedFile = event.dataTransfer.files[0];
    if (isValidFileExtension(droppedFile.name)) {
      setSelectedFile(droppedFile);
      setError('');
    } else {
      setError(`Invalid file type. Only ${props.allowedFileExtensions.join(',')} allowed.`);
    }
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (isValidFileExtension(file.name)) {
      setSelectedFile(file);
      setError('');
    } else {
      setError(`Invalid file type. Only ${props.allowedFileExtensions.join(',')} allowed.`);
    }
  };

  const isValidFileExtension = (fileName: any) => {
    const fileExtension = fileName.slice(((fileName.lastIndexOf('.') - 1) >>> 0) + 2);
    return props.allowedFileExtensions.includes('.' + fileExtension.toLowerCase());
  };

  return (
    <>
    <Container
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: `2px dashed ${dragging ? 'blue' : 'grey'}`,
        padding: '20px',
        borderRadius: '5px',
        cursor: 'pointer',
      }}
    >
      {selectedFile ? (
        <div>
          {props.imageInput ? (
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Preview"
              style={{ maxWidth: '100%', maxHeight: '200px' }}
            />
          ) : (
            <>
              <Typography variant="body1" gutterBottom>
                Selected File: {selectedFile.name}
              </Typography>
              <a
                href={URL.createObjectURL(selectedFile)}
                download={selectedFile.name}
                style={{ color: 'blue', textDecoration: 'underline' }}
              >
                Download File
              </a>
            </>
          )}
        </div>
      ) : (
        <Typography variant="body1" gutterBottom>
          Drag & Drop {props.imageInput ? ' an image ' : ' a file '}, or{' '}
          <label htmlFor={props.id} style={{ color: 'blue' }}>
            click to choose a file
          </label>
        </Typography>
      )}
      <input
        ref={ref}
        style={{ display: 'none' }}
        type="file"
        accept={props.allowedFileExtensions.join(',')}
        id={props.id}
        onChange={handleFileChange}
        disabled={selectedFile !== null}
        {...props}
      />
    </Container>
    {
      error && <Alert severity="error">{error}</Alert>
    }
    </>
  )
})
