import { useEffect, useState } from "react";
import axios from "axios";

const QiblaDirection = ({ latitude, longitude }) => {
  const [qiblaDirection, setQiblaDirection] = useState(null);
  const [deviceHeading, setDeviceHeading] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQibla = async () => {
      try {
        const res = await axios.get(
          `https://api.aladhan.com/v1/qibla/${latitude}/${longitude}`
        );
        const direction = res?.data?.data?.direction;
        setQiblaDirection(direction);
      } catch (error) {
        console.error("Error fetching Qibla direction:", error);
        setError("Could not fetch Qibla direction.");
      }
    };

    if (latitude && longitude) {
      fetchQibla();
    }
  }, [latitude, longitude]);

  // Set up device orientation listener
  useEffect(() => {
    const handleOrientation = (event) => {
      if (event.absolute && event.alpha !== null) {
        setDeviceHeading(event.alpha);
      }
    };

    window.addEventListener("deviceorientation", handleOrientation, true);

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  // Calculate the rotation angle for Qibla based on device heading
  const adjustedQiblaDirection =
    qiblaDirection !== null ? (qiblaDirection - deviceHeading + 360) % 360 : null;

  return (
    <div>
      {error ? (
        <p>{error}</p>
      ) : qiblaDirection !== null ? (
        <div>
          <h3>Qibla Direction</h3>
          <p>The Qibla is at {qiblaDirection.toFixed(2)}° from North.</p>
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
              transform: `rotate(${adjustedQiblaDirection}deg)`,
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
