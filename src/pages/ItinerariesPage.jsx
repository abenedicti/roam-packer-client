import { useEffect, useState } from 'react';
import service from '../services/service.config';
import { useNavigate } from 'react-router-dom';
import '../pages/ItinerariesPage.css';
import LoadingSpinner from '../components/LoadingSpinner';
import DeleteModal from '../components/DeleteModal';

function ItinerariesPage() {
  const [itineraries, setItineraries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItineraries = async () => {
      setIsLoading(true);
      try {
        const response = await service.get('/itineraries');
        setItineraries(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItineraries();
  }, []);

  const confirmDelete = (iti) => {
    setSelectedItinerary(iti);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedItinerary) return;

    try {
      await service.delete(`/itineraries/${selectedItinerary._id}`);
      setItineraries((prev) =>
        prev.filter((iti) => iti._id !== selectedItinerary._id),
      );
    } catch (error) {
      console.error('Error deleting itinerary:', error);
      alert('Failed to delete itinerary. Please try again.');
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedItinerary(null);
    }
  };

  const handleCreateNew = () => {
    navigate('/create-itinerary');
  };

  const handleShare = (itiId) => {
    navigate(`/itinerary/${itiId}`);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="itineraries-page">
      <div className="header">
        <h1>My Itineraries</h1>
        <button className="btn-create" onClick={handleCreateNew}>
          + Create New Itinerary
        </button>
      </div>

      {itineraries.length === 0 ? (
        <p className="empty-text">No itineraries yet. Start creating one!</p>
      ) : (
        <div className="itineraries-grid">
          {itineraries.map((iti) => (
            <div key={iti._id} className="itinerary-card fade-in">
              {/* Titre non cliquable */}
              <div className="iti-title">{iti.title}</div>
              <div className="iti-actions">
                <button
                  className="btn-edit"
                  onClick={() =>
                    navigate('/create-itinerary', {
                      state: { editId: iti._id },
                    })
                  }
                >
                  Edit
                </button>
                <button
                  className="btn-share"
                  onClick={() => handleShare(iti._id)}
                >
                  Share
                </button>
                <button
                  className="btn-delete"
                  onClick={() => confirmDelete(iti)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <DeleteModal
        isOpen={isDeleteModalOpen}
        title="Confirm Delete"
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedItinerary(null);
        }}
      >
        <p>Are you sure you want to delete this itinerary?</p>
        <div className="modal-actions">
          <button className="btn-delete" onClick={handleDelete}>
            Delete
          </button>
          <button
            onClick={() => {
              setIsDeleteModalOpen(false);
              setSelectedItinerary(null);
            }}
          >
            Cancel
          </button>
        </div>
      </DeleteModal>
    </div>
  );
}

export default ItinerariesPage;
