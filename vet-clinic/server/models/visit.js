module.exports = (sequelize, DataTypes) => {
  const Visit = sequelize.define('Visit', {
    visitDate: { type: DataTypes.DATEONLY, allowNull: false, validate: { isDate: { msg: 'visitDate must be a valid date' } } },
    symptoms: { type: DataTypes.TEXT, allowNull: true },
    diagnosis: { type: DataTypes.TEXT, allowNull: true },
    treatment: { type: DataTypes.TEXT, allowNull: true },
    petId: { type: DataTypes.INTEGER, allowNull: false },
    vetId: { type: DataTypes.INTEGER, allowNull: true },
  });
  return Visit;
};
