import { useEffect, useState, useContext, useRef, useMemo } from 'react';
import { AuthContext } from '../context/Auth.context';
import { FaTrash } from 'react-icons/fa';
import DeleteModal from '../components/DeleteModal';
import LoadingSpinner from '../components/LoadingSpinner';
import '../pages/MessagePage.css';

function MessagePage() {
  const { loggedUserId } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageText, setMessageText] = useState('');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const messagesEndRef = useRef(null);

  const appendMessageToStorage = (msg) => {
    const stored = JSON.parse(localStorage.getItem('messages')) || [];
    const updated = [...stored, msg];
    localStorage.setItem('messages', JSON.stringify(updated));
    return updated;
  };

  useEffect(() => {
    const fetchMessages = () => {
      setIsLoading(true);
      const storedMessages = JSON.parse(localStorage.getItem('messages')) || [];
      setMessages(storedMessages);
      setIsLoading(false);
    };

    fetchMessages();
    window.addEventListener('messagesUpdated', fetchMessages);
    return () => window.removeEventListener('messagesUpdated', fetchMessages);
  }, []);

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

  const currentConversation = selectedUser
    ? messages.filter(
        (msg) =>
          (msg.sender._id === selectedUser._id &&
            msg.receiver._id === loggedUserId) ||
          (msg.sender._id === loggedUserId &&
            msg.receiver._id === selectedUser._id),
      )
    : [];

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

    //* Fake answer
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDeleteConversation = (userId) => {
    setIsDeleting(true);
    const storedMessages = JSON.parse(localStorage.getItem('messages')) || [];

    const updatedMessages = storedMessages.filter(
      (msg) =>
        !(
          (msg.sender._id === userId && msg.receiver._id === loggedUserId) ||
          (msg.sender._id === loggedUserId && msg.receiver._id === userId)
        ),
    );

    localStorage.setItem('messages', JSON.stringify(updatedMessages));
    setMessages(updatedMessages);

    if (selectedUser?._id === userId) {
      setSelectedUser(null);
    }
    setIsDeleting(false);
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
            <span onClick={() => setSelectedUser(user)}>{user.username}</span>

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
