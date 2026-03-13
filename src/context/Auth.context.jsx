import { createContext, useEffect, useState } from 'react';
import service from '../services/service.config';
import LoadingSpinner from '../components/LoadingSpinner';
const AuthContext = createContext();

function AuthWrapper({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedUserId, setLoggedUserId] = useState(null);
  const [isAuthenticatingUser, setIsAuthenticatingUser] = useState(true);

  //* check token when app is loading
  const authenticateUser = async () => {
    try {
      const response = await service.get('/auth/verify');
      console.log('Verify response:', response.data);
      setIsLoggedIn(true);
      setLoggedUserId(response.data.payload._id);
    } catch (error) {
      console.log(error);

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
    const response = await service.post('/auth/login', loginData);
    localStorage.setItem('authToken', response.data.authToken);
    setIsLoggedIn(true);
    setLoggedUserId(response.data.payload._id);
  };

  const logout = () => {
    localStorage.removeItem('authToken'); // delete token
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
