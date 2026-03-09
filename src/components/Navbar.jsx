import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/Auth.context';
import './Navbar.css';

function Navbar() {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  //* separate state for each dropdown
  const [isItinerariesOpen, setItinerariesOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  //* toggle submenu (to make it appear in mobile)
  const toggleItineraries = () => setItinerariesOpen(!isItinerariesOpen);
  const toggleProfile = () => setProfileOpen(!isProfileOpen);
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">LOGO</Link>
      </div>

      <button className="hamburger" onClick={toggleMenu}>
        ☰
      </button>

      <ul className={`menu ${menuOpen ? 'open' : ''}`}>
        <li>
          <Link to="/destinations">Destinations</Link>
        </li>
        <li>
          <Link to="/matches">Match</Link>
        </li>
        <li>
          <Link to="/message">Messages</Link>
        </li>

        {isLoggedIn && (
          <>
            {/* Itineraries dropdown */}
            <li className={`dropdown ${isItinerariesOpen ? 'open' : ''}`}>
              <span onClick={toggleItineraries}>Itinéraries ▾</span>
              <ul className="submenu">
                <li>
                  <Link to="/create-itinerary">Create Itinerary</Link>
                </li>
                <li>
                  <Link to="/my-itineraries">My Itineraries</Link>
                </li>
              </ul>
            </li>

            {/* Profile dropdown */}
            <li className={`dropdown ${isProfileOpen ? 'open' : ''}`}>
              <span onClick={toggleProfile}>Profile ▾</span>
              <ul className="submenu">
                <li>
                  <Link to="/profile">My Profile</Link>
                </li>
                <li>
                  <Link to="/favorites">Favorites</Link>
                </li>
              </ul>
            </li>

            <li>
              <button onClick={logout} className="logout-button">
                Logout
              </button>
            </li>
          </>
        )}

        {!isLoggedIn && (
          <li>
            <Link to="/login">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
