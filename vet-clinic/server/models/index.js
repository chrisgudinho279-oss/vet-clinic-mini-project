const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  port: config.port,
  dialect: config.dialect,
  logging: false,
});

const db = { sequelize, Sequelize };

db.Owner = require('./owner')(sequelize, DataTypes);
db.Pet = require('./pet')(sequelize, DataTypes);
db.Veterinarian = require('./veterinarian')(sequelize, DataTypes);
db.VaccinationLog = require('./vaccinationLog')(sequelize, DataTypes);
db.Visit = require('./visit')(sequelize, DataTypes);

const { Owner, Pet, Veterinarian, VaccinationLog, Visit } = db;

// ---- Associations (all One-to-Many) ----
// Owner 1:M Pet
Owner.hasMany(Pet, { foreignKey: 'ownerId', as: 'pets', onDelete: 'CASCADE' });
Pet.belongsTo(Owner, { foreignKey: 'ownerId', as: 'owner' });

// Pet 1:M VaccinationLog
Pet.hasMany(VaccinationLog, { foreignKey: 'petId', as: 'vaccinations', onDelete: 'CASCADE' });
VaccinationLog.belongsTo(Pet, { foreignKey: 'petId', as: 'pet' });

// Pet 1:M Visit
Pet.hasMany(Visit, { foreignKey: 'petId', as: 'visits', onDelete: 'CASCADE' });
Visit.belongsTo(Pet, { foreignKey: 'petId', as: 'pet' });

// Veterinarian 1:M VaccinationLog / Visit
Veterinarian.hasMany(VaccinationLog, { foreignKey: 'vetId', as: 'vaccinations', onDelete: 'SET NULL' });
VaccinationLog.belongsTo(Veterinarian, { foreignKey: 'vetId', as: 'vet' });
Veterinarian.hasMany(Visit, { foreignKey: 'vetId', as: 'visits', onDelete: 'SET NULL' });
Visit.belongsTo(Veterinarian, { foreignKey: 'vetId', as: 'vet' });

module.exports = db;
