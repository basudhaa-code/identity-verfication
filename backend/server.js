const express = require("express");
const cors = require("cors");
require("dotenv").config();
const sequelize = require("./models/index");
const identityRoutes = require("./routes/identityRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/identity", identityRoutes);

// Connect DB and start server
sequelize.sync({ alter: true })
    .then(() => console.log("Database synced"))
    .catch(err => console.error("DB sync error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
