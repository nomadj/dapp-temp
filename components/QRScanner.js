import React, { useState, useEffect } from 'react';
import QrReader from 'react-qr-scanner';
import { Icon } from 'semantic-ui-react';

function QRCodeScanner() {
  const [cameraOpen, setCameraOpen] = useState(false);
  const [qrData, setQRData] = useState('');
  const [hasPermission, setHasPermission] = useState(null);

  const handleScan = (data) => {
    if (data) {
      setQRData(data);
    }
  };

  const handleError = (error) => {
    console.error(error);
  };

  const toggleCamera = () => {
    if (!cameraOpen) {
      // Request camera permission
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'environment' } })
        .then(() => {
          setHasPermission(true);
          setCameraOpen(true);
        })
        .catch((error) => {
          console.error('Error accessing camera:', error);
          setHasPermission(false);
        });
    } else {
      setCameraOpen(false);
      setQRData('');
    }
  };

  useEffect(() => {
    // Check if camera permission is granted initially
    navigator.permissions
      .query({ name: 'camera' })
      .then((permissionStatus) => {
        setHasPermission(permissionStatus.state === 'granted');
      });
  }, []);

  return (
    <div>
      <Icon name='camera' onClick={toggleCamera} />
      {cameraOpen && hasPermission && (
        <QrReader
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: '100%' }}
        />
      )}
      {qrData && (
        <div>
          <h2>QR Code Data:</h2>
          <p>{qrData}</p>
        </div>
      )}
    </div>
  );
}

export default QRCodeScanner;




