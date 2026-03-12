import { useEffect, useState, useContext, useRef, useMemo } from 'react';
import { AuthContext } from '../context/Auth.context';
import '../pages/MessagePage.css';

function MessagePage() {
  const { loggedUserId } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageText, setMessageText] = useState('');

  const messagesEndRef = useRef(null);

  //* Helper pour stocker les messages
  const appendMessageToStorage = (msg) => {
    const stored = JSON.parse(localStorage.getItem('messages')) || [];
    const updated = [...stored, msg];
    localStorage.setItem('messages', JSON.stringify(updated));
    return updated;
  };

  //* Load messages initial & mise à jour via event
  useEffect(() => {
    const fetchMessages = () => {
      const storedMessages = JSON.parse(localStorage.getItem('messages')) || [];
      setMessages(storedMessages);
    };

    fetchMessages();
    window.addEventListener('messagesUpdated', fetchMessages);
    return () => window.removeEventListener('messagesUpdated', fetchMessages);
  }, []);

  //* Conversations uniques
  const uniqueUsers = useMemo(() => {
    return Array.from(
      new Map(
        messages
          .map((msg) => {
            if (msg.sender._id === loggedUserId) return msg.receiver;
            if (msg.receiver._id === loggedUserId) return msg.sender;
            return null;
          })
          .filter((user) => user && user._id !== loggedUserId)
          .map((user) => [user._id, user]),
      ).values(),
    );
  }, [messages, loggedUserId]);

  //* Conversation active
  const currentConversation = selectedUser
    ? messages.filter(
        (msg) =>
          (msg.sender._id === selectedUser._id &&
            msg.receiver._id === loggedUserId) ||
          (msg.sender._id === loggedUserId &&
            msg.receiver._id === selectedUser._id),
      )
    : [];

  //* Auto-scroll sur le dernier message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedUser]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedUser) return;

    const newMessage = {
      sender: { _id: loggedUserId, username: 'You' },
      receiver: { _id: selectedUser._id, username: selectedUser.username },
      text: messageText,
      createdAt: new Date(),
    };

    const updated = appendMessageToStorage(newMessage);
    setMessages(updated);
    setMessageText('');

    //* Fake match answer
    setTimeout(() => {
      const fakeResponse = {
        sender: { _id: selectedUser._id, username: selectedUser.username },
        receiver: { _id: loggedUserId, username: 'You' },
        text: 'All good here! What about you?',
        createdAt: new Date(),
      };
      const updatedWithFake = appendMessageToStorage(fakeResponse);
      setMessages(updatedWithFake);
    }, 1500);
  };

  //* Envoi avec Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
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
                  className={`message ${msg.sender._id === loggedUserId ? 'sent' : 'received'}`}
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
              <div ref={messagesEndRef} />
            </div>

            <div className="message-input">
              <input
                type="text"
                placeholder="Type your message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={handleKeyPress}
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
