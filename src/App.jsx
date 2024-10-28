import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [qiblaDirection, setQiblaDirection] = useState(null);
  const [heading, setHeading] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Step 1: Get the user's location
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const { latitude, longitude } = position.coords;
            setLatitude(latitude);
            setLongitude(longitude);
            fetchQiblaDirection(latitude, longitude);
          },
          () => {
            setError("Unable to access your location");
          }
        );
      } else {
        setError("Geolocation is not supported by this browser.");
      }
    };

    // Step 2: Fetch Qibla direction from API
    const fetchQiblaDirection = async (latitude, longitude) => {
      try {
        const res = await axios.get(`https://api.aladhan.com/v1/qibla/${latitude}/${longitude}`);
        setQiblaDirection(res?.data?.data?.direction);
      } catch (error) {
        console.error("Error fetching Qibla direction:", error);
      }
    };

    // Step 3: Set up device orientation listener
    const handleOrientation = event => {
      const alpha = event.alpha; // Device's compass heading in degrees
      if (alpha !== null) {
        setHeading(alpha);
      }
    };

    window.addEventListener("deviceorientation", handleOrientation);
    getLocation();

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  // Step 4: Calculate the rotation for the compass
  const rotation = qiblaDirection !== null && heading !== null
    ? qiblaDirection - heading
    : 0;

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Qibla Compass</h2>
      {error ? (
        <p>{error}</p>
      ) : (
        <>
          <p>Qibla Direction: {qiblaDirection?.toFixed(2)}°</p>
          <p>Device Heading: {heading?.toFixed(2)}°</p>
          <div
            style={{
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              border: "2px solid #333",
              position: "relative",
              transform: `rotate(${rotation}deg)`,
              transition: "transform 0.5s ease"
            }}
          >
            <div
              style={{
                width: "10px",
                height: "50px",
                background: "red",
                position: "absolute",
                top: "0",
                left: "50%",
                transform: "translateX(-50%)"
              }}
            />
          </div>
          <p>Rotate your device to align with the Qibla</p>
        </>
      )}
    </div>
  );
};

export default App;
