import { useEffect, useState } from "react";
import axios from 'axios';
import './App.css';


const QiblaDirection = ({ latitude, longitude }) => {
  const [direction, setDirection] = useState(null);
  const [heading, setHeading] = useState(0);

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
      let newHeading = event.alpha;
      
      if (newHeading !== null) {
        newHeading = (newHeading + 360) % 360; // Normalize between 0-360
        setHeading(newHeading);
      
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
    const index = Math.round(direction / 45) % 8;
    return directions[index];
  };

  return (
    <div>
      {direction !== null ? (
        <div className="container">
          <div className="compass-container" style={{ position: "relative" }}>
            {/* <img
              src="https://media.geeksforgeeks.org/wp-content/uploads/20240122153821/compass.png"
              alt="Compass"
              className="compass-image"
              style={{ transform: `rotate(${direction - heading}deg)` }}
            /> */}
            <strong><h2> qibla</h2></strong>
            <div
              className="clock-needle"
              style={{
                position: "absolute",
                width: "2px",
                height: "90px",   // Length of the needle
                backgroundColor: "black",
                transform: `rotate(${direction - heading}deg) translateX(-50%)`,
                transformOrigin: "bottom center",  // Pivot from the bottom
                display: 'flex',
                bottom: "50%", // Centers needle vertically
                left: "50%",
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <div
                className="arrowhead"
                style={{
                  position: "absolute",
                  bottom: "100%",
                  left: "-4px",
                  width: "0",
                  height: "0",
                  borderLeft: "6px solid transparent",
                  borderRight: "6px solid transparent",
                  borderBottom: "10px solid black",
                }}
              />
            </div>


            {/* Qibla direction indicator */}
          </div>
          <p className="heading-value">{`Heading: ${direction - heading?.toFixed(2) || 0}°`}</p>
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
