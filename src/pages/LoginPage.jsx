import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/Auth.context';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import '../styles/auth.css';

function Login() {
  const { login } = useContext(AuthContext);
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

    const body = { email, password };

    try {
      await login(body);
      navigate('/profile');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.errorMessage);
      } else {
        console.log(error);
      }
    }
  };

  return (
    <div className="auth-page login-page">
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleEmailChange}
          required
        />

        <label>Password:</label>
        <div className="password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          <button type="button" onClick={toggleShowPassword}>
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        <button type="submit" className="btn-submit">
          Login
        </button>

        {errorMessage && <p className="error">{errorMessage}</p>}
      </form>

      <p className="signup-redirect">
        Don't have an account yet?{' '}
        <Link to="/signup" className="signup-link">
          Sign up here
        </Link>
      </p>
    </div>
  );
}

export default Login;
