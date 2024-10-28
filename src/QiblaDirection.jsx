import { useEffect, useState } from "react";
import axios from 'axios';

const QiblaDirection = ({ latitude, longitude }) => {
  const [direction, setDirection] = useState(null);
  const [deviceHeading, setDeviceHeading] = useState(0);

  // Fetch the Qibla direction from API
  useEffect(() => {
    const fetchQibla = async () => {
      try {
        const res = await axios.get(`https://api.aladhan.com/v1/qibla/${latitude}/${longitude}`);
        const qiblaDirection = res?.data?.data?.direction;
        setDirection(qiblaDirection);
      } catch (error) {
        console.error("Error fetching Qibla direction:", error);
      }
    };

    if (latitude && longitude) {
      fetchQibla();
    }
  }, [latitude, longitude]);

  // Set up device orientation listener
  useEffect(() => {
    const handleOrientation = (event) => {
      const alpha = event.webkitCompassHeading ?? event.alpha;
      if (alpha !== null) {
        setDeviceHeading(alpha);
      }
    };

    window.addEventListener("deviceorientation", handleOrientation);

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  // Adjusted rotation based on Qibla and device heading
  const adjustedRotation = direction !== null ? direction - deviceHeading : 0;

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
              transform: `rotate(${adjustedRotation}deg)`,
              transition: "transform 0.5s ease"
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
