import { useEffect, useState } from "react";
import axios from 'axios';

const QiblaDirection = ({ latitude, longitude }) => {
  const [qiblaDirection, setQiblaDirection] = useState(null);
  const [deviceOrientation, setDeviceOrientation] = useState(0);

  useEffect(() => {
    const fetchQibla = async () => {
      try {
        const res = await axios.get(`https://api.aladhan.com/v1/qibla/${latitude}/${longitude}`);
        setQiblaDirection(res?.data?.data?.direction);
      } catch (error) {
        console.error(error);
      }
    };

    const handleOrientation = (event) => {
      let angle;
      if (event.webkitCompassHeading) {
        angle = event.webkitCompassHeading;
      } else {
        angle = event.alpha ? 360 - event.alpha : 0;
      }
      setDeviceOrientation(angle);
    };

    if (window.DeviceOrientationEvent) {
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
          .then(permissionState => {
            if (permissionState === 'granted') {
              window.addEventListener('deviceorientation', handleOrientation);
            }
          })
          .catch(console.error);
      } else {
        window.addEventListener('deviceorientation', handleOrientation);
      }
    }

    if (latitude && longitude) {
      fetchQibla();
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [latitude, longitude]);

  // Calculate the actual Qibla direction relative to device orientation
  const compassRotation = -deviceOrientation;
  const qiblaRotation = qiblaDirection ? qiblaDirection - deviceOrientation : 0;

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
              transform: `rotate(${compassRotation}deg)`,
              transition: 'transform 0.2s ease-out'
            }}>
              {/* Cardinal Points */}
              <div style={{ position: "absolute", top: "10px", width: "100%", textAlign: "center", fontWeight: "bold" }}>N</div>
              <div style={{ position: "absolute", bottom: "10px", width: "100%", textAlign: "center", fontWeight: "bold" }}>S</div>
              <div style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", fontWeight: "bold" }}>E</div>
              <div style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", fontWeight: "bold" }}>W</div>

              {/* Fixed North Indicator */}
              <div style={{
                position: "absolute",
                top: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "2px",
                height: "20px",
                background: "#333"
              }} />

              {/* Qibla Arrow */}
              <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "140px",
                height: "4px",
                background: "red",
                transformOrigin: "left center",
                transform: `rotate(${qiblaRotation}deg)`,
                transition: 'transform 0.2s ease-out'
              }}>
                <div style={{
                  position: "absolute",
                  right: "-40px",
                  top: "-10px",
                  color: "red",
                  whiteSpace: "nowrap",
                  fontWeight: "bold"
                }}>
                  Qibla ▶
                </div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: "20px" }}>
            <p>Current heading: {deviceOrientation.toFixed(1)}°</p>
            <p>Qibla bearing: {qiblaRotation.toFixed(1)}°</p>
          </div>
        </div>
      ) : (
        <p>Calibrating compass...</p>
      )}
    </div>
  );
};

export default QiblaDirection;
