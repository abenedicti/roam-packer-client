import { useEffect, useState } from 'react';
import service from '../services/service.config';

function FavoritePage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmation, setConfirmation] = useState(''); // state for confirmation message

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

  const handleAddToItinerary = (fav) => {
    //* Save in localStorage without navigating
    const addedFavorites =
      JSON.parse(localStorage.getItem('addedFavorites')) || [];

    const newFav = {
      name: fav.name,
      city: fav.city,
      country: fav.country,
      lat: fav.lat || fav.y || null,
      lng: fav.lng || fav.x || null,
      comment: '',
    };

    const updatedFavorites = [...addedFavorites, newFav];
    localStorage.setItem('addedFavorites', JSON.stringify(updatedFavorites));

    setConfirmation(`✅ "${fav.name}" added to your page 'Create Itinerary!`);

    setTimeout(() => setConfirmation(''), 2000);
  };

  if (loading) return <p>Loading favorites...</p>;

  if (favorites.length === 0) return <p>You don't have any favorites yet.</p>;

  return (
    <div>
      <h1>My Favorite Activities</h1>

      {confirmation && (
        <div
          style={{
            backgroundColor: 'white',
            color: 'black',
            padding: '0.5rem 1rem',
            borderRadius: '5px',
            marginBottom: '1rem',
          }}
        >
          {confirmation}
        </div>
      )}

      <ul>
        {favorites.map((fav) => (
          <li key={fav.xid} style={{ marginBottom: '1rem' }}>
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
