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

  //* to close dropdowns when clicking on submenu
  const handleLinkClick = () => {
    setItinerariesOpen(false);
    setProfileOpen(false);

    //* close menu on mobile
    setMenuOpen(false);
  };

  //* toggle submenu (to make it appear in mobile)
  const toggleItineraries = () => setItinerariesOpen(!isItinerariesOpen);
  const toggleProfile = () => setProfileOpen(!isProfileOpen);

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">RoamPacker</Link>
      </div>

      <button className="hamburger" onClick={toggleMenu}>
        ☰
      </button>

      <ul className={`menu ${menuOpen ? 'open' : ''}`}>
        <li>
          <Link to="/destinations" onClick={handleLinkClick}>
            Destinations
          </Link>
        </li>

        <li>
          <Link
            to={isLoggedIn ? '/matches' : '/login'}
            onClick={handleLinkClick}
          >
            Match
          </Link>
        </li>

        <li>
          <Link
            to={isLoggedIn ? '/messages' : '/login'}
            onClick={handleLinkClick}
          >
            Messages
          </Link>
        </li>

        {/* Itineraries visible for everyone */}
        <li className={`dropdown ${isItinerariesOpen ? 'open' : ''}`}>
          <span onClick={toggleItineraries}>Itineraries ▾</span>
          <ul className="submenu">
            <li>
              <Link
                to={isLoggedIn ? '/create-itinerary' : '/login'}
                onClick={handleLinkClick}
              >
                Create Itinerary
              </Link>
            </li>
            <li>
              <Link
                to={isLoggedIn ? '/my-itineraries' : '/login'}
                onClick={handleLinkClick}
              >
                My Itineraries
              </Link>
            </li>
          </ul>
        </li>

        {/* Profile visible for everyone */}
        <li className={`dropdown ${isProfileOpen ? 'open' : ''}`}>
          <span onClick={toggleProfile}>Profile ▾</span>
          <ul className="submenu">
            <li>
              <Link
                to={isLoggedIn ? '/profile' : '/login'}
                onClick={handleLinkClick}
              >
                My Profile
              </Link>
            </li>
            {isLoggedIn && (
              <li>
                <Link to="/favorites" onClick={handleLinkClick}>
                  Favorites
                </Link>
              </li>
            )}
          </ul>
        </li>

        {!isLoggedIn && (
          <li>
            <Link to="/login" onClick={handleLinkClick}>
              Login
            </Link>
          </li>
        )}

        {isLoggedIn && (
          <li>
            <button onClick={logout} className="logout-button">
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
