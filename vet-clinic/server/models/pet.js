module.exports = (sequelize, DataTypes) => {
  const Pet = sequelize.define('Pet', {
    name: { type: DataTypes.STRING(80), allowNull: false, validate: { notEmpty: { msg: 'Pet name is required' } } },
    species: {
      type: DataTypes.ENUM('Dog', 'Cat', 'Bird', 'Rabbit', 'Other'),
      allowNull: false,
      validate: { isIn: { args: [['Dog', 'Cat', 'Bird', 'Rabbit', 'Other']], msg: 'Species must be Dog, Cat, Bird, Rabbit or Other' } },
    },
    breed: { type: DataTypes.STRING(80), allowNull: true },
    gender: { type: DataTypes.ENUM('Male', 'Female'), allowNull: false, defaultValue: 'Male' },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      validate: {
        isDate: { msg: 'Date of birth must be a valid date' },
        notInFuture(value) {
          if (value && new Date(value) > new Date()) throw new Error('Date of birth cannot be in the future');
        },
      },
    },
    weight: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      validate: { min: { args: [0.01], msg: 'Weight must be greater than 0' } },
    },
    ownerId: { type: DataTypes.INTEGER, allowNull: false },
  });
  return Pet;
};
