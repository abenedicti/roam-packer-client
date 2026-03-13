import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import service from '../services/service.config';
import LoadingSpinner from '../components/LoadingSpinner';

function CityPage() {
  //* fetch 'country' para from URL
  const { country } = useParams();

  const [cities, setCities] = useState([]);
  const [search, setSearch] = useState('');
  const [itemsToShow, setItemsToShow] = useState(10);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      setIsLoading(true); //* start loading
      try {
        const res = await service.get(`/destinations/${country}/cities`);
        setCities(res.data.cities || []); //* save cities or empty array
      } catch (err) {
        console.error(err);
        setCities([]); //* empty if error
      } finally {
        setIsLoading(false);
      }
    };
    fetchCities();
  }, [country]); //* if country changes, refetch

  if (isLoading) return <LoadingSpinner />;

  if (!isLoading && cities.length === 0)
    return <p>No cities found for {country}</p>;

  //* filter cities based on user input
  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="destinations">
      <h1>Cities in {country}</h1>

      <input
        type="text"
        placeholder="Search cities..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ul>
        {filteredCities.slice(0, itemsToShow).map((city) => (
          <li key={city}>
            <Link to={`/destinations/city/${city}`}>{city}</Link>
          </li>
        ))}
      </ul>

      {itemsToShow < filteredCities.length && (
        <button onClick={() => setItemsToShow((prev) => prev + 10)}>
          See more
        </button>
      )}
    </div>
  );
}

export default CityPage;
