import { useEffect, useState } from 'react';
import service from '../services/service.config';
import { Link } from 'react-router-dom';

function ItinerariesPage() {
  const [itineraries, setItineraries] = useState([]);

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await service.get('/itineraries');
        setItineraries(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchItineraries();
  }, []);

  return (
    <div>
      <h1>My Itineraries</h1>
      {itineraries.length === 0 ? (
        <p>No itineraries yet.</p>
      ) : (
        <ul>
          {itineraries.map((iti) => (
            <li key={iti._id}>
              <Link to={`/itinerary/${iti._id}`}>{iti.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ItinerariesPage;
