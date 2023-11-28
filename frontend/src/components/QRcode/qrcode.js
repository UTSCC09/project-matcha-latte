import React, { useEffect, useRef } from 'react';
import QRCodeStyling from "qr-code-styling";

const QRcomp = () => {
  const qrCodeRef = useRef(null);
  const username = "annanya";

  useEffect(() => {
    const encodedUsername = encodeURIComponent(username);
    const formUrl = `https://docs.google.com/forms/d/e/1FAIpQLSegfDHMs8kLda5nswiIH4LFUmAw396kBWxMvY5h49wQTikLzA/viewform?entry.1076970991=${encodedUsername}`;

    const qrCode = new QRCodeStyling({
      data: formUrl,
      width: 180,
      height: 180,
      dotsOptions: {
        color: '#645075',
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
