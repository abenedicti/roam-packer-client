import { useEffect, useState } from 'react';
import service from '../services/service.config';
import { Link, useNavigate } from 'react-router-dom';
import '../pages/DestinationsPages.css';

function ItinerariesPage() {
  const [itineraries, setItineraries] = useState([]);
  const navigate = useNavigate();

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

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this itinerary?',
    );
    if (!confirmDelete) return;

    try {
      await service.delete(`/itineraries/${id}`);
      setItineraries((prev) => prev.filter((iti) => iti._id !== id));
    } catch (error) {
      console.error('Error deleting itinerary:', error);
      alert('Failed to delete itinerary. Please try again.');
    }
  };

  const handleCreateNew = () => {
    navigate('/create-itinerary');
  };

  return (
    <div className="destinations">
      <h1>My Itineraries</h1>

      <button
        onClick={handleCreateNew}
        style={{ marginBottom: '1rem', fontWeight: 'bold' }}
      >
        Create New Itinerary
      </button>

      {itineraries.length === 0 ? (
        <p>No itineraries yet.</p>
      ) : (
        <ul>
          {itineraries.map((iti) => (
            <li key={iti._id}>
              <Link to={`/itinerary/${iti._id}`}>{iti.title}</Link>

              <button
                type="button"
                onClick={() =>
                  navigate('/create-itinerary', { state: { editId: iti._id } })
                }
                style={{ marginLeft: '1rem' }}
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() => handleDelete(iti._id)}
                style={{ marginLeft: '0.5rem', color: 'red' }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ItinerariesPage;
