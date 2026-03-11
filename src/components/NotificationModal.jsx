import '../components/NotificationModal.css';

function NotificationModal({ match, isOpen, onClose }) {
  if (!isOpen || !match) return null; //* if not match

  return (
    <div className="notif-modal-overlay">
      <div className="notif-modal-container">
        <h2>Match saved!</h2>
        <p>{match.username}</p>
        <button className="modal-close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default NotificationModal;
