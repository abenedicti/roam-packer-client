import { createContext, useEffect, useState } from 'react';
import service from '../services/service.config';

const AuthContext = createContext();

function AuthWrapper({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedUserId, setLoggedUserId] = useState(null);
  const [isAuthenticatingUser, setIsAuthenticatingUser] = useState(true);

  const authenticateUser = async () => {
    try {
      const response = await service.get('/auth/verify');

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

  if (isAuthenticatingUser) {
    return <h3>Authenticating...</h3>;
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        loggedUserId,
        setLoggedUserId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthWrapper };
