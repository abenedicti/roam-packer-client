import { Link } from 'react-router-dom';
import homeBg from '../img/bg-home.jpg';
import '../pages/HomePage.css';

function HomePage() {
  return (
    <div>
      <div className="home-header">
        <img src={homeBg} alt="background" />
        <h1>SoloNeverAlone</h1>
      </div>
      <div className="titles-home">
        <Link to="/destinations" className="home-link">
          Save your destinations
        </Link>
        <Link to="/find-match" className="home-link">
          Fix your budget
        </Link>
        <Link to="/find-match" className="home-link">
          Pick a date
        </Link>
        <Link to="/find-match" className="home-link">
          Find a partner
        </Link>
        <Link to="/create-itinerary" className="home-link">
          Create your trip
        </Link>
      </div>
      <div className="text-anim">
        <p>
          Create your profile, find your perfect match and organise your trip
          together !
        </p>
      </div>
    </div>
  );
}

export default HomePage;
