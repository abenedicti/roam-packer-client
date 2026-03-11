// import '../components/MessageModal.css';
// import { useState } from 'react';
// import service from '../services/service.config';

// function MessageModal({ match, isOpen, onClose, onMessageSent }) {
//   const [message, setMessage] = useState('');
//   const [sending, setSending] = useState(false);

//   if (!isOpen || !match) return null;

//   const handleSendMessage = async () => {
//     if (!message.trim()) return;
//     setSending(true);

//     try {
//       // Appel au backend pour créer le message
//       const res = await service.post('/messages', {
//         receiverId: match._id,
//         text: message,
//       });

//       const newMessage = {
//         ...res.data,
//         sender: { _id: res.data.sender, username: 'You' },
//         receiver: { _id: match._id, username: match.username },
//       };

//       // Notifie le parent
//       if (onMessageSent) onMessageSent(newMessage);

//       setMessage('');
//       onClose();
//     } catch (err) {
//       console.error('Error sending message:', err);
//       alert('Failed to send message');
//     } finally {
//       setSending(false);
//     }
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal-container">
//         <h2>Message to {match.username}</h2>
//         <textarea
//           placeholder="Write your message..."
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//         />
//         <div className="modal-buttons">
//           <button onClick={handleSendMessage} disabled={sending}>
//             {sending ? 'Sending...' : 'Send'}
//           </button>
//           <button onClick={onClose}>Cancel</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default MessageModal;
import '../components/MessageModal.css';
import { useState } from 'react';
import service from '../services/service.config';

function MessageModal({ match, isOpen, onClose, onMessageSent }) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  if (!isOpen || !match) return null;

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    setSending(true);

    try {
      // Envoie le message vers le backend
      await service.post('/messages', {
        receiverId: match._id,
        text: message,
      });

      // Reset input
      setMessage('');
      onClose();

      // Optionnel : tu peux stocker localement pour refresh immédiat
      const oldMessages = JSON.parse(localStorage.getItem('messages')) || [];
      const newMessage = {
        sender: { _id: 'me', username: 'You' }, // ID temporaire
        receiver: match,
        text: message,
        createdAt: new Date(),
      };
      if (onMessageSent) onMessageSent(newMessage);
      localStorage.setItem(
        'messages',
        JSON.stringify([...oldMessages, newMessage]),
      );
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
