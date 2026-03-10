import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/Auth.context';
import service from '../services/service.config';

function FindMatchPage() {
  // eslint-disable-next-line no-unused-vars
  const { loggedUserId } = useContext(AuthContext);
  const navigate = useNavigate();

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

  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const target = event.target;
    const name = target.name;
    const type = target.type;

    let newValue;

    if (type === 'checkbox') {
      newValue = target.checked;
    } else {
      newValue = target.value;
    }

    setCriteria((previousCriteria) => {
      return {
        ...previousCriteria,
        //* update only 'name'
        [name]: newValue,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //* check if fields are empty
    const isEmpty = Object.values(criteria).every((value) => {
      return value === '' || value === false;
    });

    if (isEmpty) {
      alert('Please fill at least one criterion to find a match.');
      return;
    }

    setLoading(true);
    try {
      //* transform "sport, music" → ["sport", "music"]
      const interestsList = criteria.interests
        ? criteria.interests.split(',').map((interest) => interest.trim())
        : [];

      const body = {
        ...criteria,
        interests: interestsList,
      };

      const response = await service.post('/find-match', body);

      const matches = response.data;

      navigate('/matches', { state: { matches } });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Find a Partner</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Budget* (€):
          <input
            type="number"
            name="budget"
            value={criteria.budget}
            onChange={handleChange}
            min="0"
            required
          />
        </label>

        <label>
          Interests* :
          <input
            type="text"
            name="interests"
            value={criteria.interests}
            onChange={handleChange}
            placeholder="e.g., Hiking, Food, Culture"
            required
          />
        </label>

        <label>
          Travel Style* :
          <input
            type="text"
            name="travelStyle"
            value={criteria.travelStyle}
            onChange={handleChange}
            placeholder="e.g., Backpacking, Luxury"
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
            min="0"
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
            placeholder="e.g., French, Thai, Indian"
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
          First Trip :
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

        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default FindMatchPage;
