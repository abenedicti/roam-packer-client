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
          <li key={country.code}>
            {/* redirect to  CityPage for this country */}
            <Link to={`/destinations/country/${country.code}`}>
              {country.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CountryPage;
