const Identity = require("../models/Identity");
const Log = require("../models/Log");
const generateQR = require("../utils/generateQR");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

exports.createIdentity = async (req, res) => {
    try {
        const { name, role } = req.body;

        // Generate JWT token for QR
        const qrToken = jwt.sign({ name, role, id: uuidv4() }, process.env.JWT_SECRET);

        // Save in database
        const identity = await Identity.create({ name, role, qrToken });

        // Generate QR code
        const qrCode = await generateQR(qrToken);

        res.json({ identity, qrCode });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.verifyQR = async (req, res) => {
    const { token } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const identity = await Identity.findOne({ where: { qrToken: token } });

        if (!identity) {
            // Log failed attempt
            await Log.create({ identityId: decoded.id, status: "failed" });
            return res.status(400).json({ message: "Invalid QR" });
        }

        // Log successful verification
        await Log.create({ identityId: identity.id, status: "success" });

        res.json({ message: "QR verified successfully", identity });
    } catch (err) {
        return res.status(400).json({ message: "Invalid QR" });
    }
};

exports.getLogs = async (req, res) => {
    try {
        const logs = await Log.findAll({ order: [["timestamp", "DESC"]] });
        res.json(logs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
