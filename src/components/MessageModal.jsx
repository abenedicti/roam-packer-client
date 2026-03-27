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
//       await service.post('/messages', {
//         receiverId: match._id,
//         text: message,
//       });

//       // Reset input
//       setMessage('');
//       onClose();

//       //* store with refresh
//       const oldMessages = JSON.parse(localStorage.getItem('messages')) || [];
//       const newMessage = {
//         sender: { _id: 'me', username: 'You' },
//         receiver: match,
//         text: message,
//         createdAt: new Date(),
//       };
//       if (onMessageSent) onMessageSent(newMessage);
//       localStorage.setItem(
//         'messages',
//         JSON.stringify([...oldMessages, newMessage]),
//       );
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
      const response = await service.post('/messages', {
        receiverId: match._id,
        text: message,
      });

      const oldMessages = JSON.parse(localStorage.getItem('messages')) || [];
      const newMessage = {
        sender: { _id: 'me', username: 'You' },
        receiver: match,
        text: message,
        createdAt: new Date().toISOString(),
      };

      if (onMessageSent) {
        onMessageSent(newMessage);
      }

      localStorage.setItem(
        'messages',
        JSON.stringify([...oldMessages, newMessage]),
      );

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
