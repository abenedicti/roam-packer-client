import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import service from '../services/service.config';

function CityPage() {
  const { cityName } = useParams();
  const [city, setCity] = useState({});
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchCity = async () => {
      try {
        const cityData = await service.get(`/destinations/city/${cityName}`);
        setCity(cityData.data);

        const activitiesData = await service.get(
          `/destinations/city/${cityName}/activities`,
        );
        setActivities(activitiesData.data.activities);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCity();
  }, [cityName]);

  return (
    <div>
      <h1>{city.city}</h1>
      <h2>Activities</h2>
      <ul>
        {activities.map((a) => (
          <li key={a.xid}>
            {a.name} ({a.kind}) - {a.dist.toFixed(0)} m away
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CityPage;
