import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import service from '../services/service.config';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import LoadingSpinner from '../components/LoadingSpinner';
import { AuthContext } from '../context/Auth.context';

function ItineraryDetailsPage() {
  const { itineraryId } = useParams();
  const { loggedUserId } = useContext(AuthContext);

  const [itinerary, setItinerary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chatUsers, setChatUsers] = useState([]);
  const [sharingStatus, setSharingStatus] = useState({});

  useEffect(() => {
    const fetchItinerary = async () => {
      setIsLoading(true);
      try {
        const res = await service.get(`/itineraries/${itineraryId}`);
        setItinerary(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItinerary();
  }, [itineraryId]);

  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem('messages')) || [];

    const uniqueUsers = new Map();

    storedMessages.forEach((msg) => {
      let otherUser = null;

      if (msg.sender._id === loggedUserId) {
        otherUser = msg.receiver;
      } else if (msg.receiver._id === loggedUserId) {
        otherUser = msg.sender;
      }

      if (otherUser && otherUser._id !== loggedUserId) {
        uniqueUsers.set(otherUser._id, otherUser);
      }
    });

    setChatUsers(Array.from(uniqueUsers.values()));
  }, [loggedUserId]);

  if (isLoading) return <LoadingSpinner />;
  if (!itinerary) return <p>No itinerary found.</p>;

  const appendMessageToStorage = (msg) => {
    const stored = JSON.parse(localStorage.getItem('messages')) || [];
    const updated = [...stored, msg];
    localStorage.setItem('messages', JSON.stringify(updated));
    window.dispatchEvent(new Event('messagesUpdated'));
    return updated;
  };

  const handleShare = async (user) => {
    try {
      await service.put(`/itineraries/${itineraryId}/share`, {
        targetUserId: user._id,
      });

      const shareMessage = {
        sender: { _id: loggedUserId, username: 'You' },
        receiver: { _id: user._id, username: user.username },
        text: `I shared an itinerary with you: "${itinerary.title}"`,
        itineraryId: itineraryId,
        createdAt: new Date(),
      };

      appendMessageToStorage(shareMessage);

      setSharingStatus((prev) => ({ ...prev, [user._id]: 'success' }));
    } catch (err) {
      console.log(err);
      setSharingStatus((prev) => ({ ...prev, [user._id]: 'error' }));
    }
  };

  return (
    <div className="itinerary-details-page">
      <h1>{itinerary.title}</h1>

      <MapContainer
        center={[48.8566, 2.3522]}
        zoom={5}
        style={{ height: '400px', width: '100%' }}
      >
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {itinerary.points.map((p, idx) => (
          <Marker key={idx} position={[p.lat, p.lng]}>
            <Popup>
              <strong>{p.city}</strong>
              <p>{p.comment}</p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div style={{ marginTop: '2rem' }}>
        <h3>Share with someone from your chat</h3>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {chatUsers.length === 0 && <p>No conversations yet to share with.</p>}

          {chatUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => handleShare(user)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: '1px solid #4caf50',
                backgroundColor:
                  sharingStatus[user._id] === 'success'
                    ? '#4caf50'
                    : sharingStatus[user._id] === 'error'
                      ? '#f44336'
                      : 'white',
                color:
                  sharingStatus[user._id] === 'success' ? 'white' : '#4caf50',
                cursor: 'pointer',
              }}
            >
              {sharingStatus[user._id] === 'success'
                ? 'Shared ✅'
                : sharingStatus[user._id] === 'error'
                  ? 'Error ❌'
                  : `Share with ${user.username}`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ItineraryDetailsPage;
