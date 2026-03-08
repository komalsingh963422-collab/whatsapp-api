const express = require("express");
const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const QRCode = require("qrcode");

const app = express();
let qrCode = "";

async function startSock() {
const { state, saveCreds } = await useMultiFileAuthState("auth");

const sock = makeWASocket({
auth: state
});

sock.ev.on("creds.update", saveCreds);

sock.ev.on("connection.update", (update) => {
const { qr } = update;
if (qr) {
qrCode = qr;
console.log("QR Generated");
}
});
}

startSock();

app.get("/", (req, res) => {
res.send("WhatsApp API Server Running");
});

app.get("/qr", async (req, res) => {
if (!qrCode) return res.send("QR not ready");
const image = await QRCode.toDataURL(qrCode);
res.send(`<img src="${image}" />`);
});

app.listen(3000, () => {
console.log("Server running on port 3000");
});
