import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import service from '../services/service.config';

function CountryPage() {
  //* get URL params
  const { continent } = useParams();
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await service.get('/destinations/destinations-data');

        //* find continent
        const continentObj = response.data.find(
          (c) => c.continent === continent,
        );

        if (continentObj) {
          setCountries(continentObj.countries);
        } else {
          setCountries([]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchCountries();
  }, [continent]);

  return (
    <div>
      <h1>Coutries in {continent}</h1>
      <ul>
        {countries.map((country) => (
          <li key={country}>
            <Link to={`/destinations/city/${country}`}>{country}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CountryPage;
