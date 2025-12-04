const { sequelize, DataTypes } = require('./index');

const Identity = sequelize.define("Identity", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false
    },
    qrToken: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Identity;