import React, { useState, useEffect } from "react";

// Define the Qibla Compass component
const QiblaDirection = () => {
  const [qiblaDirection, setQiblaDirection] = useState(null);
  const [deviceHeading, setDeviceHeading] = useState(null);

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
      // Use 'alpha' for the device heading (0 degrees is north)
      if (event.alpha !== null) {
        setDeviceHeading(event.alpha);
      }
    };

    // Check if device orientation is supported
    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleOrientation, true);
    }

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  // Calculate the Qibla angle relative to the device heading
  const getCompassRotation = () => {
    if (qiblaDirection === null || deviceHeading === null) return 0;
    
    // Calculate the relative angle from the device's orientation to the Qibla direction
    const rotation = (qiblaDirection - deviceHeading + 360) % 360;
    return rotation;
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Qibla Compass</h2>
      {qiblaDirection !== null && deviceHeading !== null ? (
        <div
          style={{
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            border: "2px solid #333",
            position: "relative",
            margin: "auto",
            background: "lightblue",
          }}
        >
          <div
            style={{
              width: "2px",
              height: "100px",
              backgroundColor: "red",
              position: "ab
