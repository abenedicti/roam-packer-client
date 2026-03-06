import { useContext } from 'react';
import { AuthContext } from '../context/Auth.context';
import { Navigate } from 'react-router-dom';

function PrivateRoute(props) {
  const { isLoggedIn } = useContext(AuthContext);
  if (isLoggedIn) {
    return props.children;
  } else {
    return <Navigate to="/login" />;
  }
}

export default PrivateRoute;
