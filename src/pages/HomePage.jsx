import { Link } from 'react-router-dom';
import homeBg from '../img/bg-home.jpg';
import '../pages/HomePage.css';
import { useEffect, useState } from 'react';

function HomePage() {
  const [showLinks, setShowLinks] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowLinks(true), 500);
    const timer2 = setTimeout(() => setShowFeatures(true), 1200);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="home-page">
      {/* Hero */}
      <div className="home-header">
        <img src={homeBg} alt="background" />
        <h1>SoloNeverAlone</h1>
      </div>

      <div className="hero-transition"></div>

      <div className={`home-actions ${showLinks ? 'fade-in-section' : ''}`}>
        <h2>Start your adventure</h2>
        <div className={`home-links ${showLinks ? 'show-links' : ''}`}>
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
      </div>

      <div
        className={`home-description ${showLinks ? 'fade-in-section' : ''}`}
        style={{ animationDelay: '0.8s' }}
      >
        <p>
          Create your profile, find your perfect match, and organize your trip
          together!
        </p>
      </div>

      <div className={`home-features ${showFeatures ? 'fade-in-section' : ''}`}>
        <h2>Why SoloNeverAlone?</h2>
        <div className={`features-grid ${showFeatures ? 'show-features' : ''}`}>
          <div className="feature-card">
            <h3>Explore</h3>
            <p>
              Discover amazing destinations tailored to your budget and
              interests.
            </p>
          </div>
          <div className="feature-card">
            <h3>Connect</h3>
            <p>Find travel partners who share your style and schedule.</p>
          </div>
          <div className="feature-card">
            <h3>Plan</h3>
            <p>
              Create itineraries easily and organize your trips step by step.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
