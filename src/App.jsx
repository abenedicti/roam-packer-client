import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { AuthWrapper } from './context/Auth.context';
import PrivateRoute from './components/PrivateRoute';
import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePage';
import './App.css';

function App() {
  return (
    <AuthWrapper>
      <Routes>
        {/* Public routes */}

        {/* <Route path='/destinations' element={<DestinationPage/>}/> */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Private routes */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </AuthWrapper>
  );
}

export default App;
