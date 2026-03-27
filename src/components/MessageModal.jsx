import '../components/MessageModal.css';
import { useState } from 'react';
import service from '../services/service.config';

function MessageModal({ match, isOpen, onClose, onMessageSent }) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  if (!isOpen || !match) return null;

  const handleSendMessage = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;
    setSending(true);

    try {
      const newMessage = {
        sender: { _id: 'me', username: 'You' },
        receiver: match,
        text: trimmedMessage,
        createdAt: new Date(),
      };

      await service.post('/messages', {
        receiverId: match._id,
        text: trimmedMessage,
      });

      if (onMessageSent) onMessageSent(newMessage);

      setMessage('');
      onClose();
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Message to {match.username}</h2>
        <textarea
          placeholder="Write your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="modal-buttons">
          <button onClick={handleSendMessage} disabled={sending}>
            {sending ? 'Sending...' : 'Send'}
          </button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default MessageModal;
