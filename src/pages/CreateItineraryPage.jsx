import { useState } from 'react';
import service from '../services/service.config';
import { useNavigate } from 'react-router-dom';

function CreateItineraryPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [points, setPoints] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  //* to add a point ot the iti
  const addPoint = () => {
    //* clone to keep previous iti and add new
    setPoints([...points, { city: '', lat: '', lng: '', comment: '' }]);
  };

  const handlePointChange = (index, field, value) => {
    const newPoints = [...points];
    //*  target and update only the index of this field
    newPoints[index][field] = value;
    setPoints(newPoints);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = { title, points };
      const response = await service.post('/itineraries', body);
      console.log('Itinerary created:', response.data);
      navigate('/my-itineraries');
    } catch (error) {
      console.log(error);
      setErrorMessage(
        error.response?.data?.errorMessage || 'Something went wrong',
      );
    }
  };

  return (
    <div>
      <h1>Create New Itinerary</h1>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <h2>Points</h2>
        {points.map((point, index) => (
          <div
            key={index}
            style={{
              border: '1px solid gray',
              padding: '5px',
              marginBottom: '5px',
            }}
          >
            <label>City:</label>
            <input
              type="text"
              value={point.city}
              onChange={(e) => handlePointChange(index, 'city', e.target.value)}
            />
            <label>Lat:</label>
            <input
              type="number"
              value={point.lat}
              onChange={(e) => handlePointChange(index, 'lat', e.target.value)}
            />
            <label>Lng:</label>
            <input
              type="number"
              value={point.lng}
              onChange={(e) => handlePointChange(index, 'lng', e.target.value)}
            />
            <label>Comment:</label>
            <input
              type="text"
              value={point.comment}
              onChange={(e) =>
                handlePointChange(index, 'comment', e.target.value)
              }
            />
          </div>
        ))}
        <button type="button" onClick={addPoint}>
          Add Point
        </button>
        <br />
        <button type="submit">Create Itinerary</button>
        {errorMessage && <p>{errorMessage}</p>}
      </form>
    </div>
  );
}

export default CreateItineraryPage;
