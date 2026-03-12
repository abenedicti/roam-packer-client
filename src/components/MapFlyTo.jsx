import { useMap } from 'react-leaflet';
import { useEffect } from 'react';

function MapFlyTo({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 6);
    }
  }, [position, map]);

  return null;
}

export default MapFlyTo;
