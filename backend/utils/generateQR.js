const QRCode = require("qrcode");

async function generateQR(data) {
    try {
        return await QRCode.toDataURL(data); // returns base64 image
    } catch (err) {
        console.error("QR generation error:", err);
        throw err;
    }
}

module.exports = generateQR;
