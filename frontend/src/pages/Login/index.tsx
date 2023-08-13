import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios'
import { useState } from "react";
import { Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

const validationSchema = yup.object({
  username: yup
    .string()
    .required('Username is required'),
  password: yup
    .string()
    .min(6, 'Password should be of minimum 6 characters length')
    .required('Password is required'),
});

export default function Login() {
  const navigate = useNavigate()
  const [error, setError] = useState('');
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async ( values ) => {
      try {
        const response: any = axios.post('http://localhost:8000/login', { 
          ...values
         }, {
          withCredentials: true, // Send cookies and authorization headers
        });
        if (response.isSucceed) {

        } else {

        }
      } catch (error) {
        console.error(error)
      }
      
      axios.post('http://localhost:8000/login', { 
        ...values
       }, {
        withCredentials: true, // Send cookies and authorization headers
      })
        .then(response => {
          navigate('/');
        })
        .catch(error => {
          console.error('Error:', error);
          setError('Invalid credentials');
        });
      } 
  });

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          boxShadow: 3,
          borderRadius: 2,
          px: 4,
          py: 6,
          marginTop: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="username"
            name="username"
            autoComplete="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            >
            Login
          </Button>
            {
              error && (
                <Alert style={{ marginTop: '4px' }} severity="error">{error}</Alert>
              )
            }
        </Box>
      </Box>
    </Container>
  );
}