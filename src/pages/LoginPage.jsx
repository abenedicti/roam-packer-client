import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/Auth.context';
import service from '../services/service.config';
import { FiEye, FiEyeOff } from 'react-icons/fi';

function Login() {
  const { setIsLoggedIn, setLoggedUserId } = useContext(AuthContext);

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const handleLogin = async (e) => {
    e.preventDefault();

    const body = {
      email,
      password,
    };

    try {
      const response = await service.post('/auth/login', body);

      console.log(response); // user authenticated

      // store token
      localStorage.setItem('authToken', response.data.authToken);

      // update context
      setIsLoggedIn(true);
      setLoggedUserId(response.data.payload._id);

      // redirect after login
      navigate('/profile');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log(error.response.data.errorMessage);
        setErrorMessage(error.response.data.errorMessage);
      } else {
        console.log(error);
      }
    }
  };

  return (
    <div>
      <h1>Login Form</h1>

      <form onSubmit={handleLogin}>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleEmailChange}
        />

        <br />

        <label>Password:</label>
        <input
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={password}
          onChange={handlePasswordChange}
        />
        <button type="button" onClick={toggleShowPassword}>
          {showPassword ? <FiEyeOff /> : <FiEye />}
        </button>
        <br />

        <button type="submit">Login</button>

        {errorMessage && <p>{errorMessage}</p>}
      </form>
    </div>
  );
}

export default Login;
