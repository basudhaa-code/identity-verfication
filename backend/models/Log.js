const { sequelize, DataTypes } = require('./index');
const Identity = require('./Identity'); // Import Identity for association

const Log = sequelize.define("Log", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    identityId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Identities',
            key: 'id'
        }
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false // 'success' or 'failed'
    }
});

// Set up association (but export before setting up if needed)
module.exports = Log;

// The association will be set up in a separate file or after all models are defined