import React, { useState } from 'react';
import { Input, Button, Segment } from 'semantic-ui-react';
import QRCode from 'qrcode.react';

const QRGenerator = (props) => {
  return (
        <div style={{ maxHeight: 150, maxWidth: 150, overflowY: 'auto', overflowX: 'auto' }}>
          <QRCode value={props.data} />
        </div>
  );
};

export default QRGenerator;

