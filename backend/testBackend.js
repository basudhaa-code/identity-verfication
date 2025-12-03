const axios = require("axios");

const serverUrl = "http://localhost:5000/api/identity"; // Your backend URL

async function testBackend() {
    try {
        console.log("=== 1. Creating Identity ===");
        const createRes = await axios.post(`${serverUrl}/create`, {
            name: "Basudha",
            role: "Student"
        });

        console.log("Create Response:", createRes.data);

        const qrToken = createRes.data.identity.qrToken;
        console.log("\nGenerated QR Token:", qrToken);

        console.log("\n=== 2. Verifying QR ===");
        const verifyRes = await axios.post(`${serverUrl}/verify`, {
            token: qrToken
        });

        console.log("Verify Response:", verifyRes.data);

        console.log("\n=== 3. Fetching Logs ===");
        const logsRes = await axios.get(`${serverUrl}/logs`);
        console.log("Logs:", logsRes.data);

    } catch (err) {
        if (err.response) {
            console.error("Error response:", err.response.data);
        } else {
            console.error("Error:", err.message);
        }
    }
}

testBackend();
