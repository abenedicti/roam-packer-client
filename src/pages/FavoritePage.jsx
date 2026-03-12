import { useEffect, useState } from 'react';
import service from '../services/service.config';
import { useNavigate } from 'react-router-dom';

function FavoritePage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const res = await service.get('/users/favorites');
        setFavorites(res.data);
      } catch (err) {
        console.error('Error fetching favorites', err);
      }
      setLoading(false);
    }

    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (fav) => {
    try {
      const res = await service.put('/users/favorites/toggle', fav);
      setFavorites(res.data);
    } catch (err) {
      console.error('Error removing favorite', err);
    }
  };

  if (loading) return <p>Loading favorites...</p>;

  if (favorites.length === 0) {
    return <p>You don't have any favorites yet.</p>;
  }

  return (
    <div>
      <h1>My Favorite Activities</h1>

      <ul>
        {favorites.map((fav) => (
          <li key={fav.xid}>
            <strong>{fav.name}</strong>

            <p>
              {fav.city}, {fav.country}
            </p>

            <p>Type: {fav.kind}</p>

            <button onClick={() => handleRemoveFavorite(fav)}>Remove</button>
            <button
              onClick={() =>
                navigate('/create-itinerary', {
                  state: { activity: fav },
                })
              }
            >
              Add to itinerary
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FavoritePage;
