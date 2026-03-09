import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import service from '../services/service.config';

function CityDetailsPage() {
  //* fetch city name from url
  const { cityName } = useParams();

  const [activities, setActivities] = useState([]);
  const [itemsToShow, setItemsToShow] = useState(10); //* nomber of activities display at start
  const [selectedType, setSelectedType] = useState('all'); //* type of act selected in the drpdown
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivities() {
      setLoading(true);
      try {
        const res = await service.get(
          `/destinations/city/${cityName}/activities`,
        );
        setActivities(res.data.activities || []); //send empty array to avoid errors when mapping
      } catch (err) {
        console.error(err);
        setActivities([]);
      }
      setLoading(false);
    }
    fetchActivities();
  }, [cityName]); // relaod data when user change the city search

  if (loading) return <p>Loading activities...</p>;

  if (!loading && activities.length === 0)
    return <p>No activities found for {cityName}.</p>;

  //* Extract all available type of activities for dropdown
  // Array.from = trasnform Set in an array to be able to use map
  const allKinds = Array.from(
    // new Set to keep unique value, prevent duplicating
    new Set(activities.flatMap((act) => act.kind.split(','))), // flatMap = split => arrays by category and bring them together
  );

  //* Filtrer by chosen type
  const filteredActivities =
    selectedType === 'all'
      ? activities
      : activities.filter((act) => act.kind.includes(selectedType));

  //* Sort by decreasing rating
  filteredActivities.sort((a, b) => (b.rate || 0) - (a.rate || 0));

  return (
    <div>
      <h1>Activities in {cityName}</h1>

      {/* Dropdown to choose type */}
      <label>
        Filter by type:{' '}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="all">All</option>
          {allKinds.map((kind) => (
            <option key={kind} value={kind}>
              {kind}
            </option>
          ))}
        </select>
      </label>

      {/* List of activities */}
      <ul>
        {filteredActivities.slice(0, itemsToShow).map((act) => (
          <li key={act.xid}>
            <strong>{act.name}</strong> ({act.kind}) – Rate: {act.rate || 0}
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
