import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import service from '../services/service.config';
import '../pages/DestinationsPages.css';

function ContinentPage() {
  const [continents, setContinents] = useState([]);

  useEffect(() => {
    const fetchContinents = async () => {
      try {
        const response = await service.get('/destinations/destinations-data');
        setContinents(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchContinents();
  }, []);

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
