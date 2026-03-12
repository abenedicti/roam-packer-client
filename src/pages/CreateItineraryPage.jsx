// CreateItineraryPage.jsx
import { useState, useEffect } from 'react';
import service from '../services/service.config';
import { useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MapClickHandler from '../components/Map';
import MapFlyTo from '../components/MapFlyTo';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet/dist/leaflet.css';
import RequiredFieldModal from '../components/RequiredFieldModal';

function CreateItineraryPage() {
  const location = useLocation();
  const editId = location.state?.editId || null;

  //* -----------------------------
  //* STATE VARIABLES
  //* -----------------------------
  const [title, setTitle] = useState('');
  const [points, setPoints] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [addedFromFavorites, setAddedFromFavorites] = useState([]);
  const [hiddenFavorites, setHiddenFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedPosition, setSearchedPosition] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);

  //* load fav from api & localStorage
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await service.get('/users/favorites');
        setFavorites(res.data || []);
      } catch (err) {
        console.error('Error fetching favorites', err);
      }
    };
    fetchFavorites();

    const storedHidden =
      JSON.parse(localStorage.getItem('hiddenFavorites')) || [];
    setHiddenFavorites(storedHidden);

    const storedAdded =
      JSON.parse(localStorage.getItem('addedFavorites')) || [];
    setAddedFromFavorites(storedAdded);
  }, []);

  //* load iti if editing
  useEffect(() => {
    const loadItinerary = async () => {
      if (!editId) {
        // new iti = clear everything
        setTitle('');
        setPoints([]);
        setAddedFromFavorites([]);
        localStorage.removeItem('itineraryPoints');
        localStorage.removeItem('addedFavorites');
        return;
      }

      try {
        const res = await service.get(`/itineraries/${editId}`);
        const iti = res.data;
        setTitle(iti.title || '');
        setPoints(iti.points || []);
        setAddedFromFavorites(iti.favorites || []);
      } catch (err) {
        console.error('Error loading itinerary for editing', err);
      }
    };
    loadItinerary();
  }, [editId]);

  //* MAP HANDLERS

  const handleAddMapPoint = async ({ lat, lng }) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
      );
      const data = await response.json();
      const city =
        data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        'Unknown';
      const country = data.address?.country || 'Unknown';
      const name = city !== 'Unknown' ? city : 'Custom location';

      setPoints((prev) => [
        ...prev,
        { name, city, country, lat, lng, comment: '' },
      ]);
    } catch (err) {
      console.error('Reverse geocoding failed', err);
      setPoints((prev) => [
        ...prev,
        {
          name: 'Custom location',
          city: 'Unknown',
          country: 'Unknown',
          lat,
          lng,
          comment: '',
        },
      ]);
    }
  };

  const handleRemovePoint = (index) =>
    setPoints((prev) => prev.filter((_, i) => i !== index));

  const handleAddFavoriteToItinerary = (fav) => {
    setPoints((prev) => [
      ...prev,
      {
        name: fav.name,
        city: fav.city,
        country: fav.country,
        lat: fav.lat || null,
        lng: fav.lng || null,
        comment: '',
      },
    ]);
  };

  const handleHideFavorite = (favId) => {
    const updated = [...hiddenFavorites, favId];
    setHiddenFavorites(updated);
    localStorage.setItem('hiddenFavorites', JSON.stringify(updated));
  };

  const handleRemoveAddedFavorite = (idx) => {
    const updated = addedFromFavorites.filter((_, i) => i !== idx);
    setAddedFromFavorites(updated);
    localStorage.setItem('addedFavorites', JSON.stringify(updated));
  };

  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      const provider = new OpenStreetMapProvider();
      const results = await provider.search({ query: searchQuery });
      if (results.length > 0) {
        const { x: lng, y: lat } = results[0];
        setSearchedPosition([lat, lng]);
      }
    } catch (err) {
      console.error('Search error', err);
    }
  };

  //* submit iti

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      setIsTitleModalOpen(true);
      return;
    }

    const body = { title, points };

    try {
      if (editId) {
        await service.put(`/itineraries/${editId}`, body);
        alert('Itinerary updated successfully!');
      } else {
        await service.post('/itineraries', body);
        alert('Itinerary created successfully!');
      }

      //* clear localStorage after save
      localStorage.removeItem('itineraryPoints');
      localStorage.removeItem('addedFavorites');

      // Stay on page → reset form if it was a new itinerary
      if (!editId) {
        setTitle('');
        setPoints([]);
        setAddedFromFavorites([]);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(
        err.response?.data?.errorMessage || 'Something went wrong',
      );
    }
  };

  return (
    <div className="create-itinerary-page">
      <h1>{editId ? 'Edit Itinerary' : 'Create New Itinerary'}</h1>

      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* SEARCH BAR */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for a country or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="button" onClick={handleSearch}>
            Search
          </button>
        </div>

        {/* MAP */}
        <MapContainer
          center={[48.8566, 2.3522]}
          zoom={5}
          style={{ height: '400px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap"
          />
          <MapFlyTo position={searchedPosition} />
          <MapClickHandler onAddPoint={handleAddMapPoint} />
          {points
            .filter((p) => p.lat && p.lng)
            .map((p, idx) => (
              <Marker key={idx} position={[p.lat, p.lng]}>
                <Popup>
                  {p.name}
                  <br />
                  {p.city}, {p.country}
                  <br />
                  {p.comment}
                </Popup>
              </Marker>
            ))}
        </MapContainer>

        {/* ITINERARY POINTS */}
        <h2>Itinerary Points</h2>
        {points.length === 0 ? (
          <p>No points added yet.</p>
        ) : (
          <ul>
            {points.map((p, idx) => (
              <li key={idx}>
                {p.name} ({p.city}, {p.country})
                <button type="button" onClick={() => handleRemovePoint(idx)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* FAVORITES */}
        <h2>Your Favorites</h2>

        {/* Backend favorites */}
        <ul>
          {favorites
            .filter((f) => !hiddenFavorites.includes(f._id))
            .map((fav) => (
              <li key={fav._id}>
                {fav.name} ({fav.city}, {fav.country})
                <button
                  type="button"
                  onClick={() => handleAddFavoriteToItinerary(fav)}
                >
                  Add to Itinerary
                </button>
                <button
                  type="button"
                  onClick={() => handleHideFavorite(fav._id)}
                >
                  Remove
                </button>
              </li>
            ))}
        </ul>

        {/* Added from FavoritePage */}
        <ul>
          {addedFromFavorites.map((fav, idx) => (
            <li key={fav.name + idx}>
              {fav.name} ({fav.city}, {fav.country})
              <button
                type="button"
                onClick={() => handleAddFavoriteToItinerary(fav)}
              >
                Add to Itinerary
              </button>
              <button
                type="button"
                onClick={() => handleRemoveAddedFavorite(idx)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        <button type="submit">
          {editId ? 'Update Itinerary' : 'Create Itinerary'}
        </button>
        {errorMessage && <p className="error">{errorMessage}</p>}
      </form>

      <RequiredFieldModal
        isOpen={isTitleModalOpen}
        message="Title required to create a new itinerary"
        onClose={() => setIsTitleModalOpen(false)}
      />
    </div>
  );
}

export default CreateItineraryPage;
