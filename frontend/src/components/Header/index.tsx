import { Container, Button } from "@mui/material"
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    Cookies.remove('token');
    navigate('/login');
  }

  return(
    <Container maxWidth={false} style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%'
    }}>
      <img style={{ width:'100px' }} src="playable_factory.png"></img>
      <Button 
        onClick={handleLogout} 
        style={{ margin: '0px 20px' }} 
        className="justify-self-end" 
        variant="contained">
          Logout
      </Button>
    </Container>
  )
}