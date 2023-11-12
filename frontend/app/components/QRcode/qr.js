import QRCode from "react-qr-code";

export const QRcomp = ({username}) => {

    const encodedUsername = encodeURIComponent(username);
    const formUrl = `https://docs.google.com/forms/d/e/1FAIpQLSegfDHMs8kLda5nswiIH4LFUmAw396kBWxMvY5h49wQTikLzA/viewform?entry.1076970991=${encodedUsername}`;


    return (
        <div style={{ height: "auto", margin: "0 auto", maxWidth: 64, width: "100%" }}>
    <QRCode
    size={256}
    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
    value={formUrl} 
    viewBox={`0 0 256 256`}
    />
        </div>
    )
}
