import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { AuthWrapper } from './context/Auth.context';
import PrivateRoute from './components/PrivateRoute';
import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePage';
import CountryPage from './pages/CoutryPage';
import CityPage from './pages/CityPage';
import ContinentPage from './pages/ContinentPage';
import FavoritePage from './pages/FavoritePage';
import FindMatchPage from './pages/FindMatchPage';
import MatchPage from './pages/MatchPage';
import NotFoundPage from './pages/NotFoundPage';
import MessagePage from './pages/MessagePage';
import CreateItineraryPage from './pages/CreateItineraryPage';
import ItinerariesPage from './pages/ItinerariesPage';
import ItineraryDetailsPage from './pages/ItineraryDetailsPage';
import Navbar from './components/Navbar';
import './App.css';
import CityDetailsPage from './pages/CityDetailsPage';
import './utils/fixLeafletIcon';
import Footer from './components/Footer';
import PublicProfile from './components/PublicProfile';

function App() {
  return (
    <AuthWrapper>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          {/* Public routes */}

          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/destinations" element={<ContinentPage />} />
          <Route
            path="/destinations/:continent/countries"
            element={<CountryPage />}
          />

          <Route path="/destinations/country/:country" element={<CityPage />} />
          <Route
            path="/destinations/city/:cityName"
            element={<CityDetailsPage />}
          />

          {/* Private routes */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <PrivateRoute>
                <FavoritePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/find-match"
            element={
              <PrivateRoute>
                <FindMatchPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/matches"
            element={
              <PrivateRoute>
                <MatchPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <PrivateRoute>
                <MessagePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/create-itinerary"
            element={
              <PrivateRoute>
                <CreateItineraryPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-itineraries"
            element={
              <PrivateRoute>
                <ItinerariesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/itinerary/:itineraryId"
            element={
              <PrivateRoute>
                <ItineraryDetailsPage />
              </PrivateRoute>
            }
          />
          <Route path="/profile/:userId" element={<PublicProfile />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </AuthWrapper>
  );
}

export default App;
