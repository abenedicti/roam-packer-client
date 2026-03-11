import '../components/NotificationModal.css';

function SendMessageModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="notif-modal-overlay">
      <div className="notif-modal-container">
        <h2>Message sent successfully!</h2>

        <button className="modal-close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default SendMessageModal;
