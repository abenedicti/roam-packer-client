import '../components/DeleteModal.css';

function DeleteModal({ isOpen, title, children, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal-content">
        <h3>{title}</h3>
        <div className="delete-modal-body">{children}</div>
        <button className="delete-modal-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default DeleteModal;
