import { useEffect, useState } from "react";
import axios from 'axios';
import './App.css'

const QiblaDirection = ({ latitude, longitude }) => {
  const [direction, setDirection] = useState(null);
  const [heading, setHeading] = useState(0);

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
  }, [latitude, longitude]);

  useEffect(() => {
    const handleOrientation = (event) => {
      let newHeading = event.alpha;

      if (newHeading !== null) {
        newHeading = (-1 * (newHeading - 85) + 360) % 360;
        setHeading(newHeading);
      }
    };

    if (typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(response => {
          if (response === 'granted') {
            window.addEventListener("deviceorientation", handleOrientation);
          }
        })
        .catch(console.error);
    } else {
      window.addEventListener("deviceorientation", handleOrientation);
    }

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  const getCardinalDirection = () => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(heading / 45) % 8;
    return directions[index];
  };

  return (
    <div>
      {direction !== null ? (
        <div className="container">
          <h1 className="app-name">Beautiful Compass App</h1>
          <div className="compass-container" style={{ position: "relative" }}>
{/*             <img
              src="https://media.geeksforgeeks.org/wp-content/uploads/20240122153821/compass.png"
              alt="Compass"
              className="compass-image"
              style={{ transform: `rotate(${direction - heading}deg)` }}
            /> */}
              <div
              className="clock-needle"
              style={{
                position: "absolute",
                top: "75px",
                left: "123px",
                width: "2px",                // Thin needle
                height: "100px",             // Length of the needle
                backgroundColor: "black",      // Color of the needle
                transform: `rotate(${direction - heading}deg) translateX(-50%)`,
                transformOrigin: "bottom center",  // Pivot from the bottom
              }}
            >
              <div
                className="arrowhead"
                style={{
                  position: "absolute",
                  bottom: "100%",  // Position arrowhead at the top of the needle
                  left: "-4px",    // Center it horizontally
                  width: "0",
                  height: "0",
                  borderLeft: "6px solid transparent",
                  borderRight: "6px solid transparent",
                  borderBottom: "10px solid black",  // Match needle color
                }}
              />
            </div>
            {/* Qibla direction indicator */}
          </div>
          <p className="heading-value">{`Heading: ${heading?.toFixed(2) || 0}°`}</p>
          <p className="cardinal-direction">{`Direction: ${getCardinalDirection()}`}</p>
          <p className="qibla-direction">{`Qibla Direction: ${direction?.toFixed(2) || 0}°`}</p>
        </div>
      ) : (
        <p>Loading Qibla direction...</p>
      )}
    </div>
  );
};

export default QiblaDirection;
