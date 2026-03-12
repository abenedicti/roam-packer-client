import '../components/RequiredFieldModal.css';
function RequiredFieldModal({ isOpen, message, onClose }) {
  // If the modal is not open, render nothing
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <p>{message}</p>

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default RequiredFieldModal;
