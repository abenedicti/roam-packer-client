import { useState } from 'react';
import service from '../services/service.config';
import '../pages/FindMatchPage.css';
import NotificationModal from '../components/NotificationModal.jsx';
import LoadingSpinner from '../components/LoadingSpinner';

function FindMatchPage() {
  const [foundMatches, setFoundMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');

  const [criteria, setCriteria] = useState({
    budget: '',
    interests: '',
    travelStyle: '',
    startDate: '',
    tripDuration: '',
    favoriteFood: '',
    preferredCountry: '',
    firstTrip: false,
    partyMood: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCriteria((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formattedCriteria = {
        ...criteria,
        interests: criteria.interests
          ? criteria.interests.split(',').map((i) => i.trim())
          : [],
      };

      const res = await service.post('/find-match', formattedCriteria);
      setFoundMatches(res.data);
    } catch (err) {
      console.error('Error fetching matches:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveMatch = async (match) => {
    try {
      await service.post('/matches/save', { match });
      setNotifTitle('Match saved!');
      setNotifMessage(`You matched with ${match.username}!`);
      setModalOpen(true);
    } catch (err) {
      console.error('Error saving match:', err);
      setNotifTitle('Error');
      setNotifMessage('Failed to save match');
      setModalOpen(true);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="find-match-page">
      <div className="form-container">
        <h1>Find a Match</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Budget* (€):
            <input
              type="number"
              name="budget"
              value={criteria.budget}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Interests:
            <input
              type="text"
              name="interests"
              value={criteria.interests}
              onChange={handleChange}
              placeholder="Hicking, Chill, Museum"
            />
          </label>

          <label>
            Travel Style* :
            <input
              type="text"
              name="travelStyle"
              value={criteria.travelStyle}
              onChange={handleChange}
              placeholder="Backpack, luxurious hotel..."
              required
            />
          </label>

          <label>
            Start Date* :
            <input
              type="date"
              name="startDate"
              value={criteria.startDate}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Trip Duration* (days):
            <input
              type="number"
              name="tripDuration"
              value={criteria.tripDuration}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Favorite Food:
            <input
              type="text"
              name="favoriteFood"
              value={criteria.favoriteFood}
              onChange={handleChange}
              placeholder="Potatoes"
            />
          </label>

          <label>
            Preferred Country:
            <input
              type="text"
              name="preferredCountry"
              value={criteria.preferredCountry}
              onChange={handleChange}
            />
          </label>

          <label>
            First Trip:
            <input
              type="checkbox"
              name="firstTrip"
              checked={criteria.firstTrip}
              onChange={handleChange}
            />
          </label>

          <label>
            Party Mood:
            <input
              type="checkbox"
              name="partyMood"
              checked={criteria.partyMood}
              onChange={handleChange}
            />
          </label>

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      <div className="matches-container">
        <h1>Matches Found</h1>
        {foundMatches.length === 0 && <p>No matches yet</p>}
        <div className="match-card">
          {foundMatches.map((match) => (
            <div className="card" key={match._id}>
              <img src={match.photoUrl} alt={match.username} />
              <p>
                <strong>{match.username}</strong>
              </p>
              <p>Match: {match.matchPercentage}%</p>
              <p>Budget: {match.budget} €</p>
              <p>Interests: {match.interests.join(', ')}</p>
              <p>Travel Style: {match.travelStyle}</p>
              <p>Trip Duration: {match.tripDuration} days</p>
              <p>Favorite Food: {match.favoriteFood}</p>
              <p>Preferred Country: {match.preferredCountry}</p>
              <button onClick={() => handleSaveMatch(match)}>Save Match</button>
            </div>
          ))}
        </div>

        <NotificationModal
          isOpen={modalOpen}
          title={notifTitle}
          message={notifMessage}
          onClose={() => {
            setModalOpen(false);
            setNotifTitle('');
            setNotifMessage('');
          }}
        />
      </div>
    </div>
  );
}

export default FindMatchPage;
