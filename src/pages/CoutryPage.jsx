import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import service from '../services/service.config';

function CountryPage() {
  const { continent } = useParams();
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await service.get(`/destinations/${continent}/countries`);
        setCountries(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCountries();
  }, [continent]);

  return (
    <div>
      <h1>Countries in {continent}</h1>
      <ul>
        {countries.map((country) => (
          <li key={country}>
            {/* on va sur la page CityPage pour ce pays */}
            <Link to={`/destinations/country/${country}`}>{country}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CountryPage;
