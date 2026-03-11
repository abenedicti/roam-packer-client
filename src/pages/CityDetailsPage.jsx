import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import service from '../services/service.config';
import '../pages/CityDetailsPage.css';

function CityDetailsPage() {
  const { cityName, countryName } = useParams(); //* if in the url

  const [activities, setActivities] = useState([]);
  const [itemsToShow, setItemsToShow] = useState(10);
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);

  //* fetch activities
  useEffect(() => {
    async function fetchActivities() {
      setLoading(true);
      try {
        const res = await service.get(
          `/destinations/city/${cityName}/activities`,
        );
        setActivities(res.data.activities || []);
      } catch (err) {
        console.error(err);
        setActivities([]);
      }
      setLoading(false);
    }

    async function fetchFavorites() {
      try {
        const res = await service.get('/favorites');
        setFavorites(res.data || []);
      } catch (err) {
        console.error('Error fetching favorites', err);
        setFavorites([]);
      }
    }

    fetchActivities();
    fetchFavorites();
  }, [cityName]);

  const allKinds = Array.from(
    new Set(activities.flatMap((act) => act.kind.split(','))),
  );

  const filteredActivities =
    selectedType === 'all'
      ? activities
      : activities.filter((act) => act.kind.includes(selectedType));

  filteredActivities.sort((a, b) => (b.rate || 0) - (a.rate || 0));

  const handleSelectType = (type) => {
    setSelectedType(type);
    setDropdownOpen(false);
    setItemsToShow(10);
  };

  const handleToggleFavorite = async (activity) => {
    try {
      const res = await service.put('/add-favorite', {
        xid: activity.xid,
        name: activity.name,
        city: cityName,
        country: countryName,
        kind: activity.kind,
        rate: activity.rate,
      });
      setFavorites(res.data);
    } catch (err) {
      console.error('Error updating favorite', err);
    }
  };

  const isFavorited = (xid) => favorites.some((f) => f.xid === xid);

  if (loading) return <p>Loading activities...</p>;
  if (!loading && activities.length === 0)
    return <p>No activities found for {cityName}.</p>;

  return (
    <div>
      <h1>Activities in {cityName}</h1>

      <div className="custom-dropdown">
        <button
          className="dropdown-button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {selectedType === 'all' ? 'Filter by type ▾' : selectedType + ' ▾'}
        </button>

        {dropdownOpen && (
          <ul className="dropdown-menu">
            <li
              onClick={() => handleSelectType('all')}
              className={selectedType === 'all' ? 'selected' : ''}
            >
              All
            </li>
            {allKinds.map((kind) => (
              <li
                key={kind}
                onClick={() => handleSelectType(kind)}
                className={selectedType === kind ? 'selected' : ''}
              >
                {kind}
              </li>
            ))}
          </ul>
        )}
      </div>

      <ul className="activities-list">
        {filteredActivities.slice(0, itemsToShow).map((act) => (
          <li key={act.xid} className="activity-item">
            <strong>{act.name}</strong> ({act.kind}) – Rate: {act.rate || 0}
            <span
              className="favorite-icon"
              onClick={() => handleToggleFavorite(act)}
            >
              {isFavorited(act.xid) ? <FaHeart color="red" /> : <FaRegHeart />}
            </span>
          </li>
        ))}
      </ul>

      {itemsToShow < filteredActivities.length && (
        <button onClick={() => setItemsToShow((prev) => prev + 10)}>
          See more
        </button>
      )}
    </div>
  );
}

export default CityDetailsPage;
