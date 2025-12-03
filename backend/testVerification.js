const axios = require("axios"); // we can use axios to call our own APIs
const Log = require("./models/Log");
const Identity = require("./models/Identity");

// Function to test verification
async function testVerification() {
    try {
        // 1. Create a new identity
        const createResponse = await axios.post("http://localhost:5000/api/identity/create", {
            name: "Test User",
            role: "Tester"
        });

        const { identity, qrCode } = createResponse.data;
        console.log("Created Identity:", identity);
        console.log("QR Code URL (first 50 chars):", qrCode.substring(0, 50) + "...");

        // 2. Verify the correct QR token (success case)
        const verifySuccess = await axios.post("http://localhost:5000/api/identity/verify", {
            token: identity.qrToken
        });
        console.log("Verification Success Response:", verifySuccess.data);

        // 3. Verify a fake QR token (failure case)
        const fakeToken = "this_is_a_fake_token";
        try {
            await axios.post("http://localhost:5000/api/identity/verify", {
                token: fakeToken
            });
        } catch (err) {
            console.log("Verification Failure Response:", err.response.data);
        }

        // 4. Print the last 5 logs
        const logs = await Log.findAll({ order: [["timestamp", "DESC"]], limit: 5 });
        console.log("Last 5 logs:");
        logs.forEach(log => {
            console.log({
                id: log.id,
                identityId: log.identityId,
                status: log.status,
                timestamp: log.timestamp
            });
        });

    } catch (err) {
        console.error("Error in testVerification:", err.message);
    }
}

testVerification();
