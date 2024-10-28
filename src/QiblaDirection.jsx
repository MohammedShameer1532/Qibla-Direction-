import { useEffect, useState } from "react";
import axios from 'axios';

const QiblaDirection = ({ latitude, longitude }) => {
  const [direction, setDirection] = useState(null);
  const [deviceHeading, setDeviceHeading] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch Qibla direction based on user location
    const fetchQibla = async () => {
      try {
        const res = await axios.get(`http://api.aladhan.com/v1/qibla/${latitude}/${longitude}`);
        const qiblaDirection = res?.data?.data?.direction;
        setDirection(qiblaDirection);
        console.log("Qibla Direction:", qiblaDirection);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch Qibla direction");
      }
    };

    if (latitude && longitude) {
      fetchQibla();
    }
  }, [latitude, longitude]);

  useEffect(() => {
    // Function to handle device orientation change
    const handleOrientation = (event) => {
      if (event.alpha !== null) {
        // 'alpha' gives the rotation around the Z axis in degrees (0 to 360)
        setDeviceHeading(event.alpha);
        console.log("Device Heading:", event.alpha);
      }
    };

    // Listen for device orientation events
    window.addEventListener("deviceorientation", handleOrientation);

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  const adjustedDirection = direction !== null ? (direction - deviceHeading + 360) % 360 : 0;

  console.log("Adjusted Direction:", adjustedDirection);

  return (
    <div>
      {error && <p>{error}</p>}
      {direction !== null ? (
        <div>
          <h3>Qibla Direction</h3>
          <p>The Qibla is at {direction.toFixed(2)}° from North.</p>
          <p>Device Heading: {deviceHeading.toFixed(2)}°</p>
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
              transform: `rotate(${adjustedDirection}deg)`, // Adjust Qibla direction based on device heading
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
