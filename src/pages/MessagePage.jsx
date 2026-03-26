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
  const [backendMessages, setBackendMessages] = useState([]);
  const [sharedMessages, setSharedMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const messagesEndRef = useRef(null);

  //* fetch backend messages
  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const res = await service.get('/messages/conversations');
      setBackendMessages(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  //* listen for shared messages in localStorage
  useEffect(() => {
    const handleStorageUpdate = () => {
      const stored = JSON.parse(localStorage.getItem('messages')) || [];
      setSharedMessages(stored);
    };
    window.addEventListener('messagesUpdated', handleStorageUpdate);
    handleStorageUpdate(); // load initially
    return () =>
      window.removeEventListener('messagesUpdated', handleStorageUpdate);
  }, []);

  //* merge backend + shared messages
  useEffect(() => {
    const combined = [...backendMessages, ...sharedMessages];
    combined.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    setMessages(combined);
  }, [backendMessages, sharedMessages]);

  //* unique users for sidebar
  const uniqueUsers = useMemo(() => {
    const map = new Map();
    messages.forEach((msg) => {
      let otherUser = null;
      if (msg.sender._id === loggedUserId) otherUser = msg.receiver;
      else if (msg.receiver._id === loggedUserId) otherUser = msg.sender;
      if (otherUser && otherUser._id !== loggedUserId)
        map.set(otherUser._id, otherUser);
    });
    return Array.from(map.values());
  }, [messages, loggedUserId]);

  //* current conversation
  const currentConversation = useMemo(() => {
    if (!selectedUser) return [];
    return messages.filter((msg) => {
      const isChatMsg =
        (msg.sender._id === selectedUser._id &&
          msg.receiver._id === loggedUserId) ||
        (msg.sender._id === loggedUserId &&
          msg.receiver._id === selectedUser._id);

      const isSharedItinerary =
        msg.itineraryId &&
        ((msg.sender._id === loggedUserId &&
          msg.receiver._id === selectedUser._id) ||
          (msg.sender._id === selectedUser._id &&
            msg.receiver._id === loggedUserId));

      return isChatMsg || isSharedItinerary;
    });
  }, [messages, selectedUser, loggedUserId]);

  //* auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation]);

  //* send text message
  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedUser) return;

    try {
      await service.post('/messages', {
        receiverId: selectedUser._id,
        text: messageText,
      });

      setMessageText('');
      fetchMessages();
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

  //* delete conversation
  const handleDeleteConversation = async (userId) => {
    setIsDeleting(true);
    try {
      await service.delete(`/messages/conversation/${userId}`);
      setBackendMessages((prev) =>
        prev.filter(
          (msg) =>
            !(
              (msg.sender._id === userId &&
                msg.receiver._id === loggedUserId) ||
              (msg.sender._id === loggedUserId && msg.receiver._id === userId)
            ),
        ),
      );
      if (selectedUser?._id === userId) setSelectedUser(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
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

  if (isLoading || isDeleting) return <LoadingSpinner />;

  return (
    <div className="message-page modern">
      <div className="sidebar modern-sidebar">
        <h2>Conversations</h2>
        {uniqueUsers.length === 0 && <p>No conversations yet</p>}
        {uniqueUsers.map((user) => (
          <div
            key={user._id}
            className={`user-item modern-user-item ${
              selectedUser?._id === user._id ? 'active' : ''
            }`}
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
            <button onClick={fetchMessages} style={{ marginBottom: '10px' }}>
              Refresh conversation
            </button>
            <div className="messages modern-messages">
              {currentConversation.map((msg, idx) => (
                <div
                  key={idx}
                  className={`message modern-message ${
                    msg.sender._id?.toString() === loggedUserId
                      ? 'sent'
                      : 'received'
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

                  {msg.itineraryId && (
                    <div style={{ marginTop: '5px' }}>
                      {msg.itineraryLink && (
                        <button
                          onClick={() =>
                            (window.location.href = msg.itineraryLink)
                          }
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            backgroundColor: '#4caf50',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          View itinerary 🗺️
                        </button>
                      )}
                      {msg.itineraryThumbnail && (
                        <img
                          src={msg.itineraryThumbnail}
                          alt="Itinerary thumbnail"
                          style={{
                            marginTop: '5px',
                            width: '100px',
                            borderRadius: '4px',
                          }}
                        />
                      )}
                    </div>
                  )}

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
