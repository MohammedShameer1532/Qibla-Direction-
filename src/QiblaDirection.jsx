import { useEffect, useState } from "react";
import axios from 'axios';

const QiblaDirection = ({ latitude, longitude }) => {
  const [qiblaDirection, setQiblaDirection] = useState(null);
  const [deviceOrientation, setDeviceOrientation] = useState(0);

  useEffect(() => {
    const fetchQibla = async () => {
      try {
        const res = await axios.get(`https://api.aladhan.com/v1/qibla/${latitude}/${longitude}`);
        console.log(res)
        setQiblaDirection(res?.data?.data?.direction);
      } catch (error) {
        console.error(error);
      }
    };

    const handleOrientation = (event) => {
      let angle;
      if (event.webkitCompassHeading) {
        // iOS devices
        angle = event.webkitCompassHeading;
      } else {
        // Android devices
        angle = 360 - event.alpha;
      }
      setDeviceOrientation(angle);
    };

    const requestPermission = async () => {
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation, true);
        }
      } else {
        window.addEventListener('deviceorientation', handleOrientation, true);
      }
    };

    if (latitude && longitude) {
      fetchQibla();
      requestPermission();
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [latitude, longitude]);

  const rotationStyle = {
    transform: `rotate(${-deviceOrientation}deg)`,
    transition: 'transform 0.2s ease-out'
  };

  const qiblaStyle = {
    transform: `rotate(${qiblaDirection}deg)`,
    transition: 'transform 0.2s ease-out'
  };

  return (
    <div className="compass-container">
      {qiblaDirection !== null ? (
        <div>
          <h3>Qibla Direction</h3>
          <p>Qibla is at {qiblaDirection.toFixed(2)}° from North</p>
          <div style={{
            width: "300px",
            height: "300px",
            margin: "0 auto",
            position: "relative"
          }}>
            {/* Compass Rose */}
            <div style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              border: "3px solid #333",
              position: "relative",
              ...rotationStyle
            }}>
              <div style={{ position: "absolute", top: "10px", width: "100%", textAlign: "center" }}>N</div>
              <div style={{ position: "absolute", bottom: "10px", width: "100%", textAlign: "center" }}>S</div>
              <div style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)" }}>E</div>
              <div style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }}>W</div>
              
              {/* Qibla Pointer */}
              <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "140px",
                height: "4px",
                background: "red",
                transformOrigin: "left center",
                ...qiblaStyle
              }}>
                <div style={{ position: "absolute", right: "-30px", top: "-10px", color: "red", whiteSpace: "nowrap" }}>
                  Qibla ▶
                </div>
              </div>
            </div>
          </div>
          <p style={{ marginTop: "20px" }}>
            Current heading: {deviceOrientation.toFixed(1)}°
          </p>
        </div>
      ) : (
        <p>Calibrating compass...</p>
      )}
    </div>
  );
};

export default QiblaDirection;
