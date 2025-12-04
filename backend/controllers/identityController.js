const Identity = require("../models/Identity");
const Log = require("../models/Log");
const generateQR = require("../utils/generateQR");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

// Create a new identity with QR token
exports.createIdentity = async (req, res) => {
    try {
        const { name, role } = req.body;
        
        // Generate a UUID for the identity
        const id = uuidv4();
        
        // Create JWT token with the SAME ID that will be saved in database
        const qrToken = jwt.sign(
            { 
                id: id,        // Include the ID in JWT
                name: name, 
                role: role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Save to database with the SAME ID
        const identity = await Identity.create({
            id: id,            // Use the same ID here
            name: name,
            role: role,
            qrToken: qrToken
        });

        // Generate QR code from the token
        const qrCode = await generateQR(qrToken);

        res.status(201).json({
            message: "Identity created successfully",
            identity,
            qrCode
        });

    } catch (error) {
        console.error("Create identity error:", error);
        res.status(500).json({ 
            message: "Error creating identity",
            error: error.message 
        });
    }
};

// Verify QR token
exports.verifyQR = async (req, res) => {
    const { qrToken } = req.body;

    // Check if token is provided
    if (!qrToken || qrToken.trim() === "") {
        // Log failed attempt - empty token
        await Log.create({
            identityId: null,
            status: 'failed',
            timestamp: new Date()
        });
        
        return res.status(400).json({ 
            success: false, 
            message: 'QR token is required' 
        });
    }

    try {
        // Verify JWT token first
        const decoded = jwt.verify(qrToken, process.env.JWT_SECRET);
        
        // Extract the ID from the decoded token
        const identityIdFromToken = decoded.id;

        // Check if identity exists in database
        const identity = await Identity.findOne({
            where: { id: identityIdFromToken }  // Lookup by ID from JWT
        });

        if (!identity) {
            // Log failed attempt - identity not found
            await Log.create({
                identityId: identityIdFromToken || null,
                status: 'failed',
                timestamp: new Date()
            });
            
            return res.status(404).json({ 
                success: false, 
                message: 'Identity not found in database' 
            });
        }

        // Optional: Check if stored qrToken matches (for extra security)
        if (identity.qrToken !== qrToken) {
            await Log.create({
                identityId: identity.id,
                status: 'failed',
                timestamp: new Date()
            });
            return res.status(400).json({ 
                success: false, 
                message: 'QR token mismatch' 
            });
        }

        // Log successful verification
        await Log.create({
            identityId: identity.id,
            status: 'success',
            timestamp: new Date()
        });

        res.json({
            success: true,
            message: 'Verification successful',
            identity: {
                id: identity.id,
                name: identity.name,
                role: identity.role
            }
        });

    } catch (error) {
        // Log failed attempt (JWT verification failed)
        let identityId = null;
        
        try {
            // Try to decode without verification to get ID for logging
            const decodedWithoutVerify = jwt.decode(qrToken);
            identityId = decodedWithoutVerify?.id || null;
        } catch (decodeErr) {
            // Can't decode, leave as null
        }
        
        await Log.create({
            identityId: identityId,
            status: 'failed',
            timestamp: new Date()
        });

        console.error('Verification error:', error.message);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid QR token format'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({
                success: false,
                message: 'QR token has expired'
            });
        }

        res.status(400).json({
            success: false,
            message: 'QR verification failed',
            error: error.message
        });
    }
};

// Get all verification logs
exports.getLogs = async (req, res) => {
    try {
        const logs = await Log.findAll({
            order: [['timestamp', 'DESC']], // Most recent first
            include: [{
                model: Identity,
                attributes: ['name', 'role']
            }]
        });

        res.json(logs);
    } catch (error) {
        console.error("Get logs error:", error);
        res.status(500).json({ 
            message: "Error fetching logs",
            error: error.message 
        });
    }
};