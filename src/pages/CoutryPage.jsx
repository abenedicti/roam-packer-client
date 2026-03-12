import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import service from '../services/service.config';
import '../pages/DestinationsPages.css';
import LoadingSpinner from '../components/LoadingSpinner';

function CountryPage() {
  const { continent } = useParams();
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      setIsLoading(true);
      try {
        const res = await service.get(`/destinations/${continent}/countries`);
        setCountries(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCountries();
  }, [continent]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="destinations">
      <h1>Countries in {continent}</h1>
      <ul>
        {countries.map((country) => (
          <li key={country.code}>
            <Link to={`/destinations/country/${country.code}`}>
              {country.name}
            </Link>
          </li>
        ))}
      </ul>
      <div
        className={`countries ${continent.toLowerCase().replace(/\s/g, '')}`}
      ></div>
    </div>
  );
}

export default CountryPage;
