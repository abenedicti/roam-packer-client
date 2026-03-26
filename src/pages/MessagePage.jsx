import { useEffect, useState, useContext, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/Auth.context';
import { FaTrash } from 'react-icons/fa';
import DeleteModal from '../components/DeleteModal';
import LoadingSpinner from '../components/LoadingSpinner';
import service from '../services/service.config';
import '../pages/MessagePage.css';

function MessagePage() {
  const navigate = useNavigate();
  const { loggedUserId } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const messagesEndRef = useRef(null);

  // Fetch all messages involving loggedUserId
  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const res = await service.get('/messages/conversations');
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Unique users for sidebar
  const uniqueUsers = useMemo(() => {
    const map = new Map();
    messages.forEach((msg) => {
      if (msg.sender._id !== loggedUserId) map.set(msg.sender._id, msg.sender);
      if (msg.receiver._id !== loggedUserId)
        map.set(msg.receiver._id, msg.receiver);
    });
    return Array.from(map.values());
  }, [messages, loggedUserId]);

  // Current conversation with selectedUser
  const currentConversation = useMemo(() => {
    if (!selectedUser) return [];
    return messages.filter(
      (msg) =>
        (msg.sender._id === selectedUser._id &&
          msg.receiver._id === loggedUserId) ||
        (msg.sender._id === loggedUserId &&
          msg.receiver._id === selectedUser._id),
    );
  }, [messages, selectedUser, loggedUserId]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation]);

  // Send message
  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedUser) return;

    try {
      const res = await service.post('/messages', {
        receiverId: selectedUser._id,
        text: messageText,
      });

      setMessages((prev) => [...prev, res.data]); // append directly
      setMessageText('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Delete conversation
  const handleDeleteConversation = async (userId) => {
    try {
      await service.delete(`/messages/conversation/${userId}`);
      setMessages((prev) =>
        prev.filter(
          (msg) => msg.sender._id !== userId && msg.receiver._id !== userId,
        ),
      );
      if (selectedUser?._id === userId) setSelectedUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteConversation = () => {
    if (!userToDelete) return;
    handleDeleteConversation(userToDelete._id);
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="message-page modern">
      <div className="sidebar modern-sidebar">
        <h2>Conversations</h2>
        {uniqueUsers.length === 0 && <p>No conversations yet</p>}
        {uniqueUsers.map((user) => (
          <div
            key={user._id}
            className={`user-item modern-user-item ${selectedUser?._id === user._id ? 'active' : ''}`}
          >
            <div className="user-info">
              <span onClick={() => setSelectedUser(user)} className="username">
                {user.username}
              </span>
              <button
                onClick={() => navigate(`/profile/${user._id}`)}
                className="profile-btn"
              >
                See Profile
              </button>
            </div>
            <FaTrash
              className="delete-icon"
              onClick={() => openDeleteModal(user)}
            />
          </div>
        ))}
      </div>

      <div className="chat-window modern-chat">
        {selectedUser ? (
          <>
            <h3>Chat with {selectedUser.username}</h3>
            <div className="messages modern-messages">
              {currentConversation.map((msg, idx) => (
                <div
                  key={idx}
                  className={`message modern-message ${
                    msg.sender._id === loggedUserId ? 'sent' : 'received'
                  }`}
                >
                  {msg.sender._id !== loggedUserId && (
                    <strong
                      onClick={() => navigate(`/profile/${msg.sender._id}`)}
                    >
                      {msg.sender.username}
                    </strong>
                  )}
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

            <div className="message-input modern-input">
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
          <p className="select-prompt">
            Select a conversation to start chatting
          </p>
        )}
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        title="Delete conversation"
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <p>
          Are you sure you want to delete the conversation with{' '}
          <strong>{userToDelete?.username}</strong>?
        </p>
        <div className="delete-modal-actions">
          <button onClick={confirmDeleteConversation}>Delete</button>
          <button onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
        </div>
      </DeleteModal>
    </div>
  );
}

export default MessagePage;
