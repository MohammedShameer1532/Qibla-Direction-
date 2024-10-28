import { useEffect, useState } from "react";
import axios from 'axios';

const QiblaDirection = ({ latitude, longitude }) => {
  const [direction, setDirection] = useState(null);
  const [deviceOrientation, setDeviceOrientation] = useState(0);

  useEffect(() => {
    const fetchQibla = async () => {
      try {
        const res = await axios.get(`https://api.aladhan.com/v1/qibla/${latitude}/${longitude}`);
        const response = res?.data?.data?.direction;
        setDirection(response);
      } catch (error) {
        console.error(error);
      }
    };

    if (latitude && longitude) {
      fetchQibla();
    }

    const handleOrientation = (event) => {
      const alpha = event.alpha;
      setDeviceOrientation(alpha);
    };

    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [latitude, longitude]);

  const calculatedDirection = direction !== null ? (direction - deviceOrientation) : 0;

  return (
    <div>
      {direction !== null ? (
        <div>
          <h3>Qibla Direction</h3>
          <p>The Qibla is at {direction.toFixed(2)}° from North.</p>
          <div
            style={{
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              border: "2px solid #333",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              transform: `rotate(${calculatedDirection}deg)`,
            }}
          >
            <div style={{ position: "absolute", top: "5%", fontSize: "1.2rem" }}>
              ↑ North
            </div>
            <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "red" }}>
              Qibla
            </div>
          </div>
        </div>
      ) : (
        <p>Loading Qibla direction...</p>
      )}
    </div>
  );
};

export default QiblaDirection;
