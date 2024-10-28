import { useEffect, useState } from "react";
import axios from 'axios';

const QiblaDirection = ({ latitude, longitude }) => {
  const [direction, setDirection] = useState(null);
  const [compassHeading, setCompassHeading] = useState(0);

  useEffect(() => {
    const fetchQibla = async () => {
      try {
        const res = await axios.get(`https://api.aladhan.com/v1/qibla/${latitude}/${longitude}`);
        console.log(res);
        const response = res?.data?.data?.direction;
        setDirection(response);
      } catch (error) {
        console.error(error);
      }
    };

    if (latitude && longitude) {
      fetchQibla();
    }
  }, [latitude, longitude]);

  useEffect(() => {
    const handleOrientation = (event) => {
      const alpha = event.alpha; // Rotation around the Z-axis (compass heading)
      setCompassHeading(alpha);
    };

    window.addEventListener('deviceorientation', handleOrientation);

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

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
              transform: `rotate(${direction - compassHeading}deg)`, // Adjust the direction based on the device's heading
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
