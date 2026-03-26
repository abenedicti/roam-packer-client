import { useEffect, useState } from 'react';
import service from '../services/service.config';
import LoadingSpinner from '../components/LoadingSpinner';
import '../pages/FavoritePage.css';

function FavoritePage() {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmation, setConfirmation] = useState('');

  useEffect(() => {
    async function fetchFavorites() {
      setIsLoading(true);
      try {
        const res = await service.get('/users/favorites');
        setFavorites(res.data);
      } catch (err) {
        console.error('Error fetching favorites', err);
      } finally {
        setIsLoading(false);
      }
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

  const handleAddToItinerary = (fav) => {
    //* Save in localStorage without navigating
    const addedFavorites =
      JSON.parse(localStorage.getItem('addedFavorites')) || [];

    const newFav = {
      name: fav.name,
      city: fav.city,
      country: fav.country,
      lat: fav.lat ?? fav.y ?? null,
      lng: fav.lng ?? fav.x ?? null,
      comment: '',
    };
    const alreadyExists = addedFavorites.some(
      (fav) =>
        fav.name === newFav.name &&
        fav.lat === newFav.lat &&
        fav.lng === newFav.lng,
    );

    if (!alreadyExists) {
      const updatedFavorites = [...addedFavorites, newFav];
      localStorage.setItem('addedFavorites', JSON.stringify(updatedFavorites));
    }

    setConfirmation(`✅ "${fav.name}" added to your page 'Create Itinerary!'`);

    setTimeout(() => setConfirmation(''), 2000);
  };

  if (isLoading) return <LoadingSpinner />;

  if (favorites.length === 0) return <p>You don't have any favorites yet.</p>;

  return (
    <div className="favorites-page">
      <h1>My Favorite Activities</h1>

      {confirmation && (
        <div className="confirmation-message">{confirmation}</div>
      )}

      <ul>
        {favorites.map((fav) => (
          <li key={fav.xid} className="favorite-item">
            <strong>{fav.name}</strong>
            <p>
              {fav.city}, {fav.country}
            </p>
            <p>Type: {fav.kind}</p>

            <button onClick={() => handleRemoveFavorite(fav)}>Remove</button>
            <button onClick={() => handleAddToItinerary(fav)}>
              Add to itinerary
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FavoritePage;
