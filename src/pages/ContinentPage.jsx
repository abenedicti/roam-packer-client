import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import service from '../services/service.config';

function ContinentPage() {
  const [continents, setContinents] = useState([]);

  useEffect(() => {
    const fetchContinents = async () => {
      try {
        //* Appel backend pour récupérer le JSON des continents
        const response = await service.get('/destinations/destinations-data');
        setContinents(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchContinents();
  }, []);

  return (
    <div>
      <h1>Continents</h1>
      <ul>
        {continents.map((continentObj) => (
          <li key={continentObj.continent}>
            <Link to={`/destinations/${continentObj.continent}/countries`}>
              {continentObj.continent}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContinentPage;
