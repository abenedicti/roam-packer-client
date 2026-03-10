import { useLocation, useNavigate } from 'react-router-dom';

function MatchPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const matches = location.state?.matches || [];

  return (
    <div>
      <h1>Your Matches</h1>

      {matches.length === 0 ? (
        <>
          <p>No matches yet.</p>
          <button onClick={() => navigate('/find-match')}>
            Search a Partner
          </button>
        </>
      ) : (
        <>
          <ul>
            {matches.map((user) => (
              <li key={user.id}>
                {user.username} — Match: {user.matchPercentage}%
              </li>
            ))}
          </ul>

          <button onClick={() => navigate('/find-match')}>Search Again</button>
        </>
      )}
    </div>
  );
}

export default MatchPage;
