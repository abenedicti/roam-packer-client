import { useState } from 'react';
import service from '../services/service.config';

function FindMatchPage() {
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

  const [foundMatches, setFoundMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCriteria((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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
      setLoading(false);
    }
  };

  const handleSaveMatch = async (match) => {
    try {
      await service.post('/matches/save', { match });
      alert(`Match saved: ${match.username}`);
    } catch (err) {
      console.error('Error saving match:', err);
      alert('Failed to save match');
    }
  };

  return (
    <div className="find-match-page">
      <h1>Find a Partner</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Budget (€):
          <input
            type="number"
            name="budget"
            value={criteria.budget}
            onChange={handleChange}
          />
        </label>

        <label>
          Interests (comma separated):
          <input
            type="text"
            name="interests"
            value={criteria.interests}
            onChange={handleChange}
          />
        </label>

        <label>
          Travel Style:
          <input
            type="text"
            name="travelStyle"
            value={criteria.travelStyle}
            onChange={handleChange}
          />
        </label>

        <label>
          Start Date:
          <input
            type="date"
            name="startDate"
            value={criteria.startDate}
            onChange={handleChange}
          />
        </label>

        <label>
          Trip Duration (months):
          <input
            type="number"
            name="tripDuration"
            value={criteria.tripDuration}
            onChange={handleChange}
          />
        </label>

        <label>
          Favorite Food:
          <input
            type="text"
            name="favoriteFood"
            value={criteria.favoriteFood}
            onChange={handleChange}
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

        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Find a Partner'}
        </button>
      </form>

      <h2>Matches Found</h2>
      {foundMatches.length === 0 && <p>No matches yet</p>}

      {foundMatches.map((match) => (
        <div
          key={match._id}
          style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}
        >
          <img src={match.photoUrl} alt={match.username} width="120" />
          <p>
            <strong>{match.username}</strong>
          </p>
          <p>Budget: {match.budget}</p>
          <p>Interests: {match.interests.join(', ')}</p>
          <p>Travel Style: {match.travelStyle}</p>
          <p>Trip Duration: {match.tripDuration}</p>
          <p>Favorite Food: {match.favoriteFood}</p>
          <p>Preferred Country: {match.preferredCountry}</p>
          <button onClick={() => handleSaveMatch(match)}>Save Match</button>
        </div>
      ))}
    </div>
  );
}

export default FindMatchPage;
