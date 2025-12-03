const express = require("express");
const router = express.Router();
const {
    createIdentity,
    verifyQR,
    getLogs
} = require("../controllers/identityController");  // Fixed import

// POST /api/identity/create → Create identity + QR
router.post("/create", createIdentity);

// POST /api/identity/verify → Scan QR  
router.post("/verify", verifyQR);

// GET /api/identity/logs → Admin dashboard
router.get("/logs", getLogs);

module.exports = router;
