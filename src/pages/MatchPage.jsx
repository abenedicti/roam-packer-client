import { useEffect, useState, useContext } from 'react';
import service from '../services/service.config';
import { AuthContext } from '../context/Auth.context';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import '../pages/MatchPage.css';
import LoadingSpinner from '../assets/spinner.json';
import MessageModal from '../components/MessageModal';
import DeleteModal from '../components/DeleteModal';
import SendMessageModal from '../components/SendMessageModal';

function MatchPage() {
  const { loggedUserId } = useContext(AuthContext);
  const navigate = useNavigate();

  const [savedMatches, setSavedMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedMatch, setSelectedMatch] = useState(null);
  const [messageModalOpen, setMessageModalOpen] = useState(false);

  const [notificationOpen, setNotificationOpen] = useState(false);

  const [matchToDelete, setMatchToDelete] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchSavedMatches = async () => {
      if (!loggedUserId) return;
      setIsLoading(true);
      try {
        const res = await service.get(`/users/${loggedUserId}`);
        setSavedMatches(res.data.savedMatchedUsers || []);
      } catch (err) {
        console.error('Error fetching saved matches', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSavedMatches();
  }, [loggedUserId]);

  const confirmDeleteMatch = (matchId) => {
    setMatchToDelete(matchId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await service.delete(`/matches/${matchToDelete}`);
      setSavedMatches(res.data);
    } catch (err) {
      console.error('Error deleting match', err);
    } finally {
      setDeleteModalOpen(false);
      setMatchToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="spinner-container">
        <Lottie
          animationData={LoadingSpinner}
          loop={true}
          className="spinner"
        />
        <p>Loading matches...</p>
      </div>
    );
  }

  return (
    <div className="match-page">
      <button
        onClick={() => navigate('/find-match')}
        className="find-match-btn"
      >
        Find your match
      </button>

      <h1>Saved Matches</h1>

      {savedMatches.length === 0 ? (
        <p>No saved matches yet</p>
      ) : (
        <div className="found-match">
          {savedMatches
            .filter(
              (match, idx, arr) =>
                match.photoUrl &&
                arr.findIndex((m) => m._id === match._id) === idx,
            )
            .map((match) => (
              <div className="card" key={match._id}>
                <img
                  src={match.photoUrl}
                  alt={match.username}
                  className="match-photo"
                />
                <h3>{match.username}</h3>
                <p>
                  <strong>Match:</strong> {match.matchPercentage}%
                </p>
                <p>
                  <strong>Travel style:</strong> {match.travelStyle}
                </p>
                <p>
                  <strong>Budget:</strong> {match.budget}€
                </p>
                <p>
                  <strong>Preferred country:</strong> {match.preferredCountry}
                </p>
                <p>
                  <strong>Favorite food:</strong> {match.favoriteFood}
                </p>

                <button
                  className="message-btn"
                  onClick={() => {
                    setSelectedMatch(match);
                    setMessageModalOpen(true);
                  }}
                >
                  Send a message
                </button>

                <button
                  onClick={() => confirmDeleteMatch(match._id)}
                  className="delete-btn"
                >
                  Delete Match
                </button>
              </div>
            ))}
        </div>
      )}

      {selectedMatch && (
        <MessageModal
          match={selectedMatch}
          isOpen={messageModalOpen}
          onClose={() => {
            setMessageModalOpen(false);
            setSelectedMatch(null);
          }}
          onMessageSent={(newMessage) => {
            const stored = JSON.parse(localStorage.getItem('messages')) || [];
            const updated = [
              ...stored,
              { ...newMessage, sender: { _id: loggedUserId, username: 'You' } },
            ];
            localStorage.setItem('messages', JSON.stringify(updated));
            window.dispatchEvent(new Event('messagesUpdated'));

            setNotificationOpen(true);
            setTimeout(() => setNotificationOpen(false), 2000);

            setTimeout(() => {
              const fakeResponse = {
                sender: newMessage.receiver,
                receiver: { _id: loggedUserId, username: 'You' },
                text: 'Hello! Thanks for your message 😄',
                createdAt: new Date(),
              };
              const updatedWithFake = [...updated, fakeResponse];
              localStorage.setItem('messages', JSON.stringify(updatedWithFake));
              window.dispatchEvent(new Event('messagesUpdated'));
            }, 1500);
          }}
        />
      )}

      <SendMessageModal
        isOpen={notificationOpen}
        onClose={() => setNotificationOpen(false)}
      />

      {matchToDelete && (
        <DeleteModal
          isOpen={deleteModalOpen}
          title="Confirm Delete"
          onClose={() => setDeleteModalOpen(false)}
        >
          <p>Do you really want to delete this match?</p>
          <button onClick={handleConfirmDelete}>Yes, Delete</button>
          <button onClick={() => setDeleteModalOpen(false)}>Cancel</button>
        </DeleteModal>
      )}
    </div>
  );
}

export default MatchPage;
