import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import service from '../services/service.config';

function CityPage() {
  const { country } = useParams();
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true); // start loading
      try {
        const res = await service.get(`/destinations/${country}/cities`);
        setCities(res.data.cities);
      } catch (error) {
        console.log(error);
        setCities([]); // empty if error
      } finally {
        setLoading(false); // end loading
      }
    };
    fetchCities();
  }, [country]);

  if (loading) return <p>Loading cities...</p>;
  if (!loading && cities.length === 0)
    return <p>No cities found for this country</p>;

  return (
    <div>
      <h1>Cities in {country}</h1>
      <ul>
        {cities.map((city) => (
          <li key={city}>
            <Link to={`/destinations/city/${city}`}>{city}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CityPage;
