import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import service from '../services/service.config';

function ItineraryDetailsPage() {
  const { itineraryId } = useParams();
  const [itinerary, setItinerary] = useState(null);

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const response = await service.get(`/itineraries/${itineraryId}`);
        setItinerary(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchItinerary();
  }, [itineraryId]);

  if (!itinerary) return <p>Loading itinerary...</p>;

  return (
    <div>
      <h1>{itinerary.title}</h1>
      <h2>Points:</h2>
      <ul>
        {itinerary.points.map((point, index) => (
          <li key={index}>
            {point.city} ({point.lat}, {point.lng}) – {point.comment}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ItineraryDetailsPage;
