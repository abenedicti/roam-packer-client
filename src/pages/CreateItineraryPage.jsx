// CreateItineraryPage.jsx
import { useState, useEffect, useRef } from 'react';
import service from '../services/service.config';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MapClickHandler from '../components/Map';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet/dist/leaflet.css';
// import '../pages/CreateItineraryPage.css';

function CreateItineraryPage() {
  const navigate = useNavigate();
  const mapRef = useRef(null);

  const [title, setTitle] = useState('');
  const [points, setPoints] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  //* Load points from localStorage to persist on refresh
  useEffect(() => {
    const savedPoints = JSON.parse(localStorage.getItem('itineraryPoints'));
    if (savedPoints) setPoints(savedPoints);
  }, []);

  //* Save points to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('itineraryPoints', JSON.stringify(points));
  }, [points]);

  //* Fetch user's favorites from backend
  useEffect(() => {
    async function fetchFavorites() {
      try {
        const res = await service.get('/users/favorites');
        setFavorites(res.data || []);
      } catch (err) {
        console.error('Error fetching favorites', err);
        setFavorites([]);
      }
    }
    fetchFavorites();
  }, []);

  //* Handle click on map to add a point with reverse geocoding
  const handleAddMapPoint = async ({ lat, lng }) => {
    try {
      // Reverse geocoding to get city/country
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
      );
      const data = await res.json();
      const city =
        data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        'Unknown';
      const country = data.address?.country || 'Unknown';
      const name = city !== 'Unknown' ? city : 'Custom location';

      const newPoint = { name, city, country, lat, lng, comment: '' };
      setPoints((prev) => [...prev, newPoint]);
    } catch (err) {
      console.error('Error reverse geocoding:', err);
      // fallback if geocoding fails
      const newPoint = {
        name: 'Custom location',
        city: 'Unknown',
        country: 'Unknown',
        lat,
        lng,
        comment: '',
      };
      setPoints((prev) => [...prev, newPoint]);
    }
  };

  //* Remove point from itinerary
  const handleRemovePoint = (index) => {
    setPoints((prev) => prev.filter((_, i) => i !== index));
  };

  //* Add favorite to itinerary
  const handleAddFavoriteToItinerary = (fav) => {
    const newPoint = {
      name: fav.name,
      city: fav.city,
      country: fav.country,
      lat: fav.lat || null,
      lng: fav.lng || null,
      comment: '',
    };
    setPoints((prev) => [...prev, newPoint]);
  };

  //* Search country/city and recenter map
  const handleSearch = async () => {
    if (!searchQuery) return;

    const provider = new OpenStreetMapProvider();
    const results = await provider.search({ query: searchQuery, limit: 1 });

    if (results && results.length > 0) {
      const { x: lng, y: lat } = results[0];

      // Fly map to searched location
      if (mapRef.current) {
        mapRef.current.flyTo([lat, lng], 6); // zoom level 6
      }
    }
  };

  //* Submit itinerary
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!title) {
        setErrorMessage('Please enter a title for your itinerary');
        return;
      }

      const body = { title, points };
      const response = await service.post('/itineraries', body);
      console.log('Itinerary created:', response.data);

      localStorage.removeItem('itineraryPoints'); // clear saved points
      navigate('/my-itineraries');
    } catch (error) {
      console.log(error);
      setErrorMessage(
        error.response?.data?.errorMessage || 'Something went wrong',
      );
    }
  };

  return (
    <div className="create-itinerary-page">
      <h1>Create New Itinerary</h1>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Search bar */}
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

        {/* Map */}
        <MapContainer
          center={[48.8566, 2.3522]}
          zoom={5}
          style={{ height: '400px', width: '100%' }}
          whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
        >
          <TileLayer
            attribution="© OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Handle map clicks */}
          <MapClickHandler onAddPoint={handleAddMapPoint} />

          {/* Render markers */}
          {points
            .filter((p) => p.lat && p.lng)
            .map((point, index) => (
              <Marker key={index} position={[point.lat, point.lng]}>
                <Popup>
                  {point.name} <br />
                  {point.city}, {point.country} <br />
                  {point.comment}
                </Popup>
              </Marker>
            ))}
        </MapContainer>

        {/* List of points */}
        <h2>Itinerary Points</h2>
        {points.length === 0 ? (
          <p>No points added yet.</p>
        ) : (
          <ul>
            {points.map((point, index) => (
              <li key={index}>
                {point.name} ({point.city}, {point.country})
                <button type="button" onClick={() => handleRemovePoint(index)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Favorites */}
        <h2>Your Favorites</h2>
        {favorites.length === 0 ? (
          <p>No favorites yet.</p>
        ) : (
          <ul>
            {favorites.map((fav, index) => (
              <li key={index}>
                {fav.name} ({fav.city}, {fav.country})
                <button
                  type="button"
                  onClick={() => handleAddFavoriteToItinerary(fav)}
                >
                  Add to Itinerary
                </button>
              </li>
            ))}
          </ul>
        )}

        <button type="submit">Create Itinerary</button>
        {errorMessage && <p className="error">{errorMessage}</p>}
      </form>
    </div>
  );
}

export default CreateItineraryPage;
