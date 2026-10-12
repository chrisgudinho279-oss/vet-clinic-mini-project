module.exports = (sequelize, DataTypes) => {
  const Veterinarian = sequelize.define('Veterinarian', {
    name: { type: DataTypes.STRING(100), allowNull: false, validate: { notEmpty: { msg: 'Vet name is required' } } },
    specialization: { type: DataTypes.STRING(100), allowNull: true },
    email: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: { name: 'unique_vet_email', msg: 'A vet with this email already exists' },
      validate: { isEmail: { msg: 'Enter a valid email address' } },
    },
  });
  return Veterinarian;
};
