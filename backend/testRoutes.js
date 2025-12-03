// testRoutes.js

const axios = require("axios");
const serverUrl = "http://localhost:5000"; // your backend server URL

async function testCreateIdentity() {
    try {
        // FIX 1: Changed URL from "/identities" to "/api/identity/create"
        const response = await axios.post(`${serverUrl}/api/identity/create`, { 
            name: "Basudha",
            role: "Student"
        });
        console.log("Create Response:", response.data);
    } catch (err) {
        console.error("Error creating identity:", err.response ? err.response.data : err.message);
    }
}

async function testGetLogs() {
    try {
        // FIX 2: Changed URL from "/logs" to "/api/identity/logs"
        const response = await axios.get(`${serverUrl}/api/identity/logs`); 
        console.log("Logs Response:", response.data);
    } catch (err) {
        console.error("Error getting logs:", err.response ? err.response.data : err.message);
    }
}

// Run tests
(async function runTests() {
    // Ensure your server is running (e.g., in a separate terminal) before running this script!
    await testCreateIdentity();
    await testGetLogs();
})();