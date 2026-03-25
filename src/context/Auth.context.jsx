import { createContext, useEffect, useState } from 'react';
import service from '../services/service.config';
import LoadingSpinner from '../components/LoadingSpinner';

const AuthContext = createContext();

function AuthWrapper({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedUserId, setLoggedUserId] = useState(null);
  const [isAuthenticatingUser, setIsAuthenticatingUser] = useState(true);

  // check the token when app is loading
  const authenticateUser = async () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      setIsLoggedIn(false);
      setLoggedUserId(null);
      setIsAuthenticatingUser(false);
      return;
    }

    try {
      const response = await service.get('/auth/verify');
      console.log('Verify response:', response.data);
      setIsLoggedIn(true);
      setLoggedUserId(response.data.payload._id);
    } catch (error) {
      console.log('Token verification failed:', error);
      setIsLoggedIn(false);
      setLoggedUserId(null);
    } finally {
      setIsAuthenticatingUser(false);
    }
  };

  useEffect(() => {
    authenticateUser();
  }, []);

  const login = async (loginData) => {
    try {
      const response = await service.post('/auth/login', loginData);
      console.log('Login response:', response.data);
      localStorage.setItem('authToken', response.data.authToken);
      setIsLoggedIn(true);
      setLoggedUserId(response.data.payload._id);
    } catch (error) {
      console.log('Login error:', error.response?.data || error.message);
      throw error; // allow form to manage error
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    setLoggedUserId(null);
  };

  if (isAuthenticatingUser) {
    return (
      <div className="spinner-container">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        loggedUserId,
        setLoggedUserId,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthWrapper };
