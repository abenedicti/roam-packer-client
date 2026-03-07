import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/Auth.context';
import './Navbar.css';

function Navbar() {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo">
        <Link to="/">LOGO</Link>
      </div>

      <button className="hamburger" onClick={toggleMenu}>
        ☰
      </button>

      {/* Menu */}
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
            <li className="dropdown">
              <span>Itinéraries ▾</span>
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
            <li className="dropdown">
              <span>Profile ▾</span>
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
