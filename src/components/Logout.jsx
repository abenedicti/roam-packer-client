import { useContext } from 'react';
import { AuthContext } from '../context/Auth.context';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); //* delete token and clear
    navigate('/login');
  };

  return (
    <button onClick={handleLogout} className="logout-btn">
      Logout
    </button>
  );
}

export default LogoutButton;
