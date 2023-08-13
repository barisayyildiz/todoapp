import './App.css';
import Home from './pages/Home';
import Login from './pages/Login'
import { Header } from './components/Header/'
import { Container } from '@mui/material';
import { Routes, Route, Outlet, Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios'
import { useNavigate, useLocation } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // validates the cookie
  useEffect(() => {
    axios.post('http://localhost:8000/user', {
      token: Cookies.get('token')
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((response: any) => {
      if (response.data.isSucceed) {
        setIsLoading(false);
      } else {
        setIsLoading(false);
        Cookies.remove('token');
      }
    })
    .catch(() => {
      setIsLoading(false);
      Cookies.remove('token');
    })
  }, [])

  if (!isLoading) {
    if (location.pathname === '/login' && Cookies.get('token')) {
      navigate('/');
    } else if (location.pathname === '/' && !Cookies.get('token')) {
      navigate('/login');
    }
  }

  if (
    isLoading ||
    (location.pathname === '/login' && Cookies.get('token')) ||
    (location.pathname !== '/login' && !Cookies.get('token'))
  ) {
    return <CircularProgress style={{
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)'
    }} />
  }

  return (
    <Container maxWidth={false} style={{
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      width: '100%',
    }}>
      <Routes>
        <Route index element={
          <>
            <Header></Header>
            <Home></Home> 
          </>
        } />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Container>
  );
}

export default App;
