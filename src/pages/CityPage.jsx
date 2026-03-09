import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import service from '../services/service.config';

function CityPage() {
  //* fetch 'country' para from URL
  const { country } = useParams();

  const [cities, setCities] = useState([]); //* List of cities fetch from BE
  const [search, setSearch] = useState(''); //* user text to filter research
  const [itemsToShow, setItemsToShow] = useState(10); //* cities display to the screen
  const [loading, setLoading] = useState(true); //* datas are loading

  //* fetch datas when loading
  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true); //* loading state
      try {
        const res = await service.get(`/destinations/${country}/cities`);
        setCities(res.data.cities || []); //* save cities or empty array if nothing
      } catch (err) {
        console.error(err);
        setCities([]); //* if error, empty the list
      }
      setLoading(false); //* stop loading
    };
    fetchCities();
  }, [country]); //* if change country restart request

  if (loading) return <p>Loading cities...</p>;

  if (!loading && cities.length === 0)
    return <p>No cities found for {country}</p>;

  //* fetch cities regarding text added by the user
  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <h1>Cities in {country}</h1>

      {/* to filter cities */}
      <input
        type="text"
        placeholder="Search cities..."
        value={search}
        onChange={(e) => setSearch(e.target.value)} //* update of search when user is tipping
      />

      {/* List fo cities*/}
      <ul>
        {/* to not display all the list  */}
        {filteredCities.slice(0, itemsToShow).map((city) => (
          <li key={city}>
            <Link to={`/destinations/city/${city}`}>{city}</Link>
          </li>
        ))}
      </ul>

      {/* button to add 10 more cities to show*/}
      {itemsToShow < filteredCities.length && (
        <button onClick={() => setItemsToShow((prev) => prev + 10)}>
          See more
        </button>
      )}
    </div>
  );
}

export default CityPage;
