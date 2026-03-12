import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaStar, FaRegStar } from 'react-icons/fa';
import service from '../services/service.config';
import '../pages/CityDetailsPage.css';
import LoadingSpinner from '../components/LoadingSpinner';

function CityDetailsPage() {
  //* get city name from the URL
  const { cityName, countryName } = useParams();
  const [cityActivities, setCityActivities] = useState([]);

  //* number of activities currently displayed
  const [visibleActivitiesCount, setVisibleActivitiesCount] = useState(10);

  const [selectedActivityType, setSelectedActivityType] = useState('all');

  //* loading state while fetching API data
  const [isLoading, setIsLoading] = useState(true);

  //* controls dropdown visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userFavorites, setUserFavorites] = useState([]);

  //* fetch activities and favorites when the page loads
  useEffect(() => {
    async function fetchCityData() {
      setIsLoading(true);

      try {
        const activitiesResponse = await service.get(
          `/destinations/city/${cityName}/activities`,
        );

        const activitiesWithRate = (
          activitiesResponse.data.activities || []
        ).map((activity) => ({
          ...activity,
          displayRate:
            typeof activity.rate === 'number'
              ? Math.min(5, Math.max(1, Math.round(activity.rate)))
              : Math.floor(Math.random() * 5) + 1,
        }));

        setCityActivities(activitiesWithRate);

        const favoritesResponse = await service.get('/users/favorites');

        setUserFavorites(favoritesResponse.data || []);
      } catch (error) {
        console.error('Error loading city data', error);
        setCityActivities([]);
        setUserFavorites([]);
      }

      setIsLoading(false);
    }

    fetchCityData();
  }, [cityName]);

  //* extract all activity categories (kinds) from the activities list
  const activityTypes = Array.from(
    new Set(cityActivities.flatMap((activity) => activity.kind.split(','))),
  );

  const filteredActivities =
    selectedActivityType === 'all'
      ? cityActivities
      : cityActivities.filter((activity) =>
          activity.kind.includes(selectedActivityType),
        );

  filteredActivities.sort((a, b) => (b.rate || 0) - (a.rate || 0));

  const handleSelectActivityType = (type) => {
    setSelectedActivityType(type);
    setIsDropdownOpen(false);
    setVisibleActivitiesCount(10); //* reset number of displayed activities
  };

  //* add or remove an activity from favorites
  const handleToggleFavorite = async (activity) => {
    try {
      const response = await service.put('/users/favorites/toggle', {
        xid: activity.xid,
        name: activity.name,
        city: cityName,
        country: countryName,
        kind: activity.kind,
        rate: activity.rate,
        lat: activity.lat,
        lng: activity.lon,
      });

      //* backend returns the updated favorites list
      setUserFavorites(response.data);
    } catch (error) {
      console.error('Error updating favorite', error);
    }
  };

  //* check if an activity is already saved as favorite
  const isActivityFavorited = (xid) =>
    userFavorites.some((favorite) => favorite.xid === xid);

  if (isLoading) return <LoadingSpinner />;

  if (!isLoading && cityActivities.length === 0)
    return <p>No activities found for {cityName}.</p>;

  return (
    <div>
      <h1>Activities in {cityName}</h1>

      <div className="custom-dropdown">
        <button
          className="dropdown-button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {selectedActivityType === 'all'
            ? 'Filter by type ▾'
            : selectedActivityType + ' ▾'}
        </button>

        {isDropdownOpen && (
          <ul className="dropdown-menu">
            <li
              onClick={() => handleSelectActivityType('all')}
              className={selectedActivityType === 'all' ? 'selected' : ''}
            >
              All
            </li>

            {activityTypes.map((type) => (
              <li
                key={type}
                onClick={() => handleSelectActivityType(type)}
                className={selectedActivityType === type ? 'selected' : ''}
              >
                {type}
              </li>
            ))}
          </ul>
        )}
      </div>

      <ul className="activities-list">
        {filteredActivities.slice(0, visibleActivitiesCount).map((activity) => {
          const displayRate = activity.displayRate;

          return (
            <li key={activity.xid} className="activity-item">
              <strong>{activity.name}</strong> ({activity.kind}) – Rate:
              <span className="stars">
                {Array.from({ length: 5 }, (_, i) =>
                  i < displayRate ? (
                    <FaStar key={i} color="#f5b50a" />
                  ) : (
                    <FaRegStar key={i} color="#ccc" />
                  ),
                )}
              </span>
              <span
                className="favorite-icon"
                onClick={() => handleToggleFavorite(activity)}
              >
                {isActivityFavorited(activity.xid) ? (
                  <FaHeart color="red" />
                ) : (
                  <FaRegHeart />
                )}
              </span>
            </li>
          );
        })}
      </ul>

      {visibleActivitiesCount < filteredActivities.length && (
        <button
          onClick={() =>
            setVisibleActivitiesCount((prevCount) => prevCount + 10)
          }
        >
          See more
        </button>
      )}
    </div>
  );
}

export default CityDetailsPage;
