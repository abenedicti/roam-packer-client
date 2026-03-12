import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import service from '../services/service.config';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

function ItineraryDetailsPage() {
  const { itineraryId } = useParams();

  const [itinerary, setItinerary] = useState(null);
  const [matchId, setMatchId] = useState('');

  useEffect(() => {
    async function fetchItinerary() {
      try {
        const res = await service.get(`/itineraries/${itineraryId}`);

        setItinerary(res.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchItinerary();
  }, [itineraryId]);

  if (!itinerary) return <p>Loading itinerary...</p>;

  const handleShare = async () => {
    try {
      await service.put(`/itineraries/${itineraryId}/share`, {
        targetUserId: matchId,
      });

      alert('Itinerary shared!');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <h1>{itinerary.title}</h1>

      <MapContainer
        center={[48.8566, 2.3522]}
        zoom={5}
        style={{ height: '400px' }}
      >
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {itinerary.points.map((point, index) => (
          <Marker key={index} position={[point.lat, point.lng]}>
            <Popup>
              <strong>{point.city}</strong>

              <p>{point.comment}</p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <h3>Share with a match</h3>

      <input
        type="text"
        placeholder="Enter match user id"
        value={matchId}
        onChange={(e) => setMatchId(e.target.value)}
      />

      <button onClick={handleShare}>Share itinerary</button>
    </div>
  );
}

export default ItineraryDetailsPage;
