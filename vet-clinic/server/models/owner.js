module.exports = (sequelize, DataTypes) => {
  const Owner = sequelize.define('Owner', {
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { notEmpty: { msg: 'Owner name is required' } },
    },
    email: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: { name: 'unique_owner_email', msg: 'An owner with this email already exists' },
      validate: { isEmail: { msg: 'Enter a valid email address' } },
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: false,
      validate: { is: { args: /^[0-9+\-\s]{7,15}$/, msg: 'Phone must be 7-15 digits (may include + - space)' } },
    },
    address: { type: DataTypes.STRING(255), allowNull: true },
  });
  return Owner;
};
