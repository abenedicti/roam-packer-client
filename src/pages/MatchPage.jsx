import { useEffect, useState, useContext } from 'react';
import service from '../services/service.config';
import { AuthContext } from '../context/Auth.context';
import { useNavigate } from 'react-router-dom';
import '../pages/MatchPage.css';
import MessageModal from '../components/MessageModal';
import DeleteModal from '../components/DeleteModal';
import NotificationModal from '../components/NotificationModal';

function MatchPage() {
  const { loggedUserId } = useContext(AuthContext);
  const [savedMatches, setSavedMatches] = useState([]);

  //* state fro MessageModal
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [messageModalOpen, setMessageModalOpen] = useState(false);

  //* state for NotificationModal
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  //* state for DeleteModal
  const [matchToDelete, setMatchToDelete] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavedMatches = async () => {
      try {
        const res = await service.get(`/users/${loggedUserId}`);
        setSavedMatches(res.data.savedMatchedUsers || []);
      } catch (err) {
        console.error('Error fetching saved matches', err);
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

  return (
    <div className="match-page">
      <button onClick={() => navigate('/find-match')}>Find your match</button>

      <h1>Saved Matches</h1>

      {savedMatches.length === 0 && <p>No saved matches yet</p>}

      <div className="found-match">
        {savedMatches
          .filter(
            (match, idx, arr) =>
              match.photoUrl &&
              arr.findIndex((m) => m._id === match._id) === idx,
          )
          .map((match, index) => (
            <div className="card" key={index}>
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

      {/* Message Modal */}
      {selectedMatch && (
        <MessageModal
          match={selectedMatch}
          isOpen={messageModalOpen}
          onClose={() => {
            setMessageModalOpen(false);
            setSelectedMatch(null);
          }}
          onMessageSent={(newMessage) => {
            //* store msg
            const stored = JSON.parse(localStorage.getItem('messages')) || [];
            const updated = [
              ...stored,
              {
                ...newMessage,
                sender: { _id: loggedUserId, username: 'You' },
              },
            ];
            localStorage.setItem('messages', JSON.stringify(updated));
            window.dispatchEvent(new Event('messagesUpdated'));

            //! not working, need to fix it
            setNotificationMessage(
              `Message envoyé avec succès à ${newMessage.receiver.username}`,
            );
            setNotificationOpen(true);
            setTimeout(() => setNotificationOpen(false), 2000);

            //* fake match answer
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

      <NotificationModal
        message={notificationMessage}
        isOpen={notificationOpen}
        onClose={() => setNotificationOpen(false)}
      />

      {matchToDelete && (
        <DeleteModal
          isOpen={deleteModalOpen}
          title="Confirm Delete"
          onClose={() => setDeleteModalOpen(false)}
        >
          <p>Are you sure you want to delete this match?</p>
          <button onClick={handleConfirmDelete}>Yes, Delete</button>
          <button onClick={() => setDeleteModalOpen(false)}>Cancel</button>
        </DeleteModal>
      )}
    </div>
  );
}

export default MatchPage;
