import { useEffect, useState, useContext } from 'react';
import service from '../services/service.config';
import { AuthContext } from '../context/Auth.context';

function MatchPage() {
  const { loggedUserId } = useContext(AuthContext);
  const [savedMatches, setSavedMatches] = useState([]);

  useEffect(() => {
    const fetchSavedMatches = async () => {
      try {
        const res = await service.get(`/users/${loggedUserId}`);
        setSavedMatches(res.data.savedMatchedUsers || []);
      } catch (err) {
        console.error('Error fetching saved matches', err);
      }
    };
    fetchSavedMatches();
  }, [loggedUserId]);

  return (
    <div>
      <h1>Saved Matches</h1>
      {savedMatches.length === 0 && <p>No saved matches yet</p>}
      {savedMatches.map((match, index) => (
        <div key={index}>
          <img src={match.photoUrl} alt={match.username} width="120" />
          <h3>{match.username}</h3>
        </div>
      ))}
    </div>
  );
}

export default MatchPage;
