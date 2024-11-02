import React, { useState, useEffect } from "react";

// Define the Qibla Compass component
const QiblaDirection = () => {
  const [qiblaDirection, setQiblaDirection] = useState(null);
  const [deviceOrientation, setDeviceOrientation] = useState(0);

  // Function to fetch Qibla direction from Aladhan API
  const fetchQiblaDirection = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.aladhan.com/v1/qibla/${latitude}/${longitude}`
      );
      const data = await response.json();
      setQiblaDirection(data.data.direction);
    } catch (error) {
      console.error("Error fetching Qibla direction:", error);
    }
  };

  // Get user's location and call the API
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      fetchQiblaDirection(latitude, longitude);
    });
  }, []);

  // Device orientation event handler
  useEffect(() => {
    const handleOrientation = (event) => {
      setDeviceOrientation(event.alpha); // device's heading direction
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleOrientation, true);
    }

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  // Calculate the Qibla angle relative to the device orientation
  const getCompassRotation = () => {
    if (qiblaDirection === null) return 0;
    return qiblaDirection - deviceOrientation;
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Qibla Compass</h2>
      {qiblaDirection !== null ? (
        <div
          style={{
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            border: "2px solid #333",
            position: "relative",
            margin: "auto",
          }}
        >
          <div
            style={{
              width: "2px",
              height: "100px",
              backgroundColor: "red",
              position: "absolute",
              top: "50px",
              left: "99px",
              transform: `rotate(${getCompassRotation()}deg)`,
              transformOrigin: "bottom center",
            }}
          />
          <p>Your device heading: {Math.round(deviceOrientation)}°</p>
          <p>Qibla direction: {Math.round(qiblaDirection)}°</p>
        </div>
      ) : (
        <p>Loading Qibla direction...</p>
      )}
    </div>
  );
};

export default QiblaDirection;
