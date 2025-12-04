const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

// Create Sequelize instance
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "postgres",
        logging: false
    }
);

// Test connection
sequelize.authenticate()
    .then(() => console.log("PostgreSQL connected"))
    .catch(err => console.log("DB connection error:", err));

module.exports = { sequelize, DataTypes };