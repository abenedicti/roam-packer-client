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

    const body = {
      email,
      username,
      password,
    };

    try {
      const response = await service.post('/auth/signup', body);
      console.log(response); // user created

      // redirect after signup
      navigate('/login');
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
      <h1>Signup</h1>

      <form onSubmit={handleSignup}>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleEmailChange}
        />

        <br />

        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={username}
          onChange={handleUsernameChange}
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

        <button type="submit">Signup</button>

        {errorMessage && <p>{errorMessage}</p>}
      </form>
    </div>
  );
}

export default Signup;
