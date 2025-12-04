const axios = require("axios");

const serverUrl = "http://localhost:5000/api/identity";

async function testBackend() {
    try {
        console.log("=== 1. Creating Identity ===");
        const createRes = await axios.post(`${serverUrl}/create`, {
            name: "Test User",
            role: "Developer"
        });

        console.log("✅ Create Response:", createRes.data.message || "Identity created");
        
        const identity = createRes.data.identity;
        const qrToken = identity.qrToken;
        const identityId = identity.id;
        
        console.log("Identity ID:", identityId);
        console.log("QR Token (first 50 chars):", qrToken.substring(0, 50) + "...");

        // ---------------------------
        // SUCCESSFUL VERIFICATION
        // ---------------------------
        console.log("\n=== 2. Verifying QR (Should PASS) ===");
        try {
            const verifyRes = await axios.post(`${serverUrl}/verify`, {
                qrToken: qrToken
            });
            console.log("✅ Success Verify Response:", verifyRes.data);
        } catch (verifyErr) {
            console.log("❌ Verify Error:", verifyErr.response?.data || verifyErr.message);
        }

        // ---------------------------
        // FAILED VERIFICATION - Invalid token
        // ---------------------------
        console.log("\n=== 3. Verifying QR (Should FAIL - Invalid token) ===");
        const fakeToken = qrToken.slice(0, -10) + "xxxxxxxxxx";
        
        try {
            const failRes = await axios.post(`${serverUrl}/verify`, {
                qrToken: fakeToken
            });
            console.log("Fail Response:", failRes.data);
        } catch (failErr) {
            console.log("✅ Expected Failure:", failErr.response?.data?.message || "Token rejected");
        }

        // ---------------------------
        // FAILED VERIFICATION - Empty token
        // ---------------------------
        console.log("\n=== 4. Verifying QR (Should FAIL - Empty token) ===");
        try {
            const emptyRes = await axios.post(`${serverUrl}/verify`, {
                qrToken: ""
            });
            console.log("Empty Response:", emptyRes.data);
        } catch (emptyErr) {
            console.log("✅ Expected Empty Failure:", emptyErr.response?.data?.message || "Empty token rejected");
        }

        // ---------------------------
        // CHECK DATABASE LOGS DIRECTLY
        // ---------------------------
        console.log("\n=== 5. Checking Database Logs ===");
        
        // Option 1: Use your logs endpoint
        console.log("Fetching logs via API endpoint...");
        try {
            const logsRes = await axios.get(`${serverUrl}/logs`);
            const logs = logsRes.data;
            
            console.log(`\n📊 Total Logs: ${logs.length}`);
            
            // Group by status
            const successLogs = logs.filter(log => log.status === 'success');
            const failedLogs = logs.filter(log => log.status === 'failed');
            
            console.log(`✅ Success Logs: ${successLogs.length}`);
            console.log(`❌ Failed Logs: ${failedLogs.length}`);
            
            // Display all logs
            console.log("\n📋 All Logs:");
            logs.forEach((log, index) => {
                console.log(`\nLog ${index + 1}:`);
                console.log(`  Status: ${log.status}`);
                console.log(`  Identity ID: ${log.identityId || 'null'}`);
                console.log(`  Timestamp: ${new Date(log.timestamp).toLocaleString()}`);
            });
            
            // Verification
            if (successLogs.length >= 1 && failedLogs.length >= 2) {
                console.log("\n🎉 SUCCESS! Both success and failed logs are being saved!");
            } else {
                console.log("\n⚠️  WARNING: Not enough logs. Check controller implementation.");
            }
            
        } catch (logsErr) {
            console.log("❌ Error fetching logs:", logsErr.response?.data || logsErr.message);
            
            // Option 2: Direct database check suggestion
            console.log("\n💡 Manual Database Check:");
            console.log("1. Connect to your PostgreSQL database:");
            console.log("   psql -U your_username -d your_database");
            console.log("2. Run: SELECT * FROM \"Logs\";");
            console.log("3. You should see at least 3 rows (1 success, 2 failed)");
        }

    } catch (err) {
        console.error("❌ Test Error:", err.response?.data || err.message);
    }
}

// Run test
testBackend();