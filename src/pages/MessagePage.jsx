import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/Auth.context';
import '../pages/MessagePage.css';

function MessagePage() {
  const { loggedUserId } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageText, setMessageText] = useState('');

  //* load msg from localStorage and updates
  useEffect(() => {
    const fetchMessages = () => {
      const storedMessages = JSON.parse(localStorage.getItem('messages')) || [];
      setMessages(storedMessages);
    };

    //* initial load
    fetchMessages();

    //* read msg from MatchPage
    window.addEventListener('messagesUpdated', fetchMessages);

    return () => {
      window.removeEventListener('messagesUpdated', fetchMessages);
    };
  }, []);

  //* not include connected user
  const uniqueUsers = Array.from(
    new Map(
      messages
        .map((msg) => {
          if (msg.sender._id === loggedUserId) return msg.receiver;
          if (msg.receiver._id === loggedUserId) return msg.sender;
          return null; // ignore les messages entre autres utilisateurs
        })
        .filter((user) => user && user._id !== loggedUserId)
        .map((user) => [user._id, user]),
    ).values(),
  );

  //* msg from selected conv
  const currentConversation = selectedUser
    ? messages.filter(
        (msg) =>
          (msg.sender._id === selectedUser._id &&
            msg.receiver._id === loggedUserId) ||
          (msg.sender._id === loggedUserId &&
            msg.receiver._id === selectedUser._id),
      )
    : [];

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedUser) return;

    const newMessage = {
      sender: { _id: loggedUserId, username: 'You' },
      receiver: { _id: selectedUser._id, username: selectedUser.username },
      text: messageText,
      createdAt: new Date(),
    };

    setMessages((prev) => {
      const updated = [...prev, newMessage];
      localStorage.setItem('messages', JSON.stringify(updated));
      return updated;
    });
    setMessageText('');

    //* fake match answer
    setTimeout(() => {
      setMessages((prev) => {
        const fakeResponse = {
          sender: { _id: selectedUser._id, username: selectedUser.username },
          receiver: { _id: loggedUserId, username: 'You' },
          text: 'Hello! Thanks for your message 😄',
          createdAt: new Date(),
        };
        const updated = [...prev, fakeResponse];
        localStorage.setItem('messages', JSON.stringify(updated));
        return updated;
      });
    }, 1500);
  };

  return (
    <div className="message-page">
      <div className="sidebar">
        <h2>Conversations</h2>
        {uniqueUsers.length === 0 && <p>No conversations yet</p>}
        {uniqueUsers.map((user) => (
          <div
            key={user._id}
            className={`user-item ${selectedUser?._id === user._id ? 'active' : ''}`}
            onClick={() => setSelectedUser(user)}
          >
            {user.username}
          </div>
        ))}
      </div>

      <div className="chat-window">
        {selectedUser ? (
          <>
            <h3>Chat with {selectedUser.username}</h3>
            <div className="messages">
              {currentConversation.map((msg, idx) => (
                <div
                  key={idx}
                  className={`message ${
                    msg.sender._id === loggedUserId ? 'sent' : 'received'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className="time">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              ))}
            </div>

            <div className="message-input">
              <input
                type="text"
                placeholder="Type your message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </>
        ) : (
          <p>Select a conversation to start chatting</p>
        )}
      </div>
    </div>
  );
}

export default MessagePage;
