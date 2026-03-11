import { useEffect, useState } from 'react';
import service from '../services/service.config';
import { FaHeart } from 'react-icons/fa';

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const res = await service.get('/users/favorites');
        setFavorites(res.data || []);
      } catch (err) {
        console.error('Error fetching favorites', err);
      }
    }
    fetchFavorites();
  }, []);

  if (!favorites || favorites.length === 0)
    return <p>No favorite activities yet.</p>;

  return (
    <div>
      <h1>My Favorite Activities</h1>
      <ul className="favorites-list">
        {favorites.map((f) => (
          <li key={f.xid}>
            <FaHeart color="red" /> {f.name} – {f.city}, {f.country} ({f.kind})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FavoritesPage;
