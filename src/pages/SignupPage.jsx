import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import service from '../services/service.config';
import { FiEye, FiEyeOff } from 'react-icons/fi';

function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const handleSignup = async (e) => {
    e.preventDefault();

    const body = { email, username, password };

    try {
      await service.post('/auth/signup', body);
      navigate('/login'); // redirect after signup
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.errorMessage);
      } else {
        console.log(error);
      }
    }
  };

  return (
    <div className="auth-page signup-page">
      <h1>Signup</h1>

      <form onSubmit={handleSignup}>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleEmailChange}
          required
        />

        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={username}
          onChange={handleUsernameChange}
          required
        />

        <label>Password:</label>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          <button
            type="button"
            onClick={toggleShowPassword}
            style={{ background: 'none', border: 'none', marginLeft: '0.5rem' }}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        <button type="submit"></button>

        {errorMessage && <p className="error">{errorMessage}</p>}
      </form>
    </div>
  );
}

export default Signup;
