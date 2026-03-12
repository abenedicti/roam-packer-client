import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import service from '../services/service.config';
import '../pages/DestinationsPages.css';
import LoadingSpinner from '../components/LoadingSpinner';

function ContinentPage() {
  const [continents, setContinents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContinents = async () => {
      setIsLoading(true);
      try {
        const response = await service.get('/destinations/destinations-data');
        setContinents(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContinents();
  }, []);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="destinations">
      <h1>Destinations</h1>
      <ul>
        {continents.map((c) => (
          <li key={c.continent}>
            <Link to={`/destinations/${c.continent}/countries`}>
              {c.continent}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContinentPage;
