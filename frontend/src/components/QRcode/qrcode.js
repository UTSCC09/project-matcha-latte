import React, { useEffect, useRef } from 'react';
import QRCodeStyling from "qr-code-styling";

const QRcomp = ({ username }) => {
  const qrCodeRef = useRef(null);

  useEffect(() => {
    const encodedUsername = encodeURIComponent(username);
    const formUrl = `https://docs.google.com/forms/d/e/1FAIpQLSegfDHMs8kLda5nswiIH4LFUmAw396kBWxMvY5h49wQTikLzA/viewform?entry.1076970991=${encodedUsername}`;

    const qrCode = new QRCodeStyling({
      data: formUrl,
      width: 180,
      height: 180,
      dotsOptions: {
        color: '#0D0447',
        type: 'rounded',
      },
      backgroundOptions: {
        color: 'transparent',
      }
    });

    qrCode.append(qrCodeRef.current);
  }, [username]);

  return <div ref={qrCodeRef}></div>;
};

export default QRcomp;
