// import { useMapEvents } from 'react-leaflet';

// function MapClickHandler({ onAddPoint }) {
//   useMapEvents({
//     click(e) {
//       const { lat, lng } = e.latlng;

//       const newPoint = {
//         city: 'Custom location',
//         lat,
//         lng,
//         comment: '',
//       };

//       onAddPoint(newPoint);
//     },
//   });

//   return null;
// }
// export default MapClickHandler;
import { useMapEvents } from 'react-leaflet';

function MapClickHandler({ onAddPoint }) {
  useMapEvents({
    click(e) {
      onAddPoint(e.latlng);
    },
  });

  return null;
}

export default MapClickHandler;
