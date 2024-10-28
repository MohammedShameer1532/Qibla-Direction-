import { useState, useEffect } from 'react';
import QiblaDirection from './QiblaDirection';

function App() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Request user location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (err) => setError(err.message)
    );
  }, []);

  return (
    <div className="App">
      <h1>Qibla Direction Finder</h1>
      {latitude && longitude ? (
        <QiblaDirection latitude={latitude} longitude={longitude} />
      ) : error ? (
        <p>Error fetching location: {error}</p>
      ) : (
        <p>Loading location...</p>
      )}
    </div>
  );
}

export default App;
