const Identity = require('./Identity');
const Log = require('./Log');

// Set up associations
Identity.hasMany(Log, { foreignKey: 'identityId' });
Log.belongsTo(Identity, { foreignKey: 'identityId' });

console.log("Database associations set up");