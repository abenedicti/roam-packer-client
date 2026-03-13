import '../components/NotificationModal.css';

function NotificationModal({ isOpen, title, message, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="notif-modal-overlay">
      <div className="notif-modal-container">
        <h2>{title}</h2>
        {message && <p>{message}</p>}

        <button className="modal-close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default NotificationModal;
