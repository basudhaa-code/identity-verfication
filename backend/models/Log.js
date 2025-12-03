const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const Log = sequelize.define("Log", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    identityId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Log;
