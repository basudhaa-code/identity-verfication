const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import models and associations
const { sequelize } = require("./models/index");
const identityRoutes = require("./routes/identityRoutes");

// Import associations file
require("./models/associations");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/identity", identityRoutes);

// Sync database with associations
sequelize.sync({ alter: true })
    .then(() => {
        console.log("Database synced with associations");
    })
    .catch(err => {
        console.error("Database sync error:", err);
    });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));