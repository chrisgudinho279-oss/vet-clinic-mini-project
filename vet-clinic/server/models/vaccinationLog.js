module.exports = (sequelize, DataTypes) => {
  const VaccinationLog = sequelize.define(
    'VaccinationLog',
    {
      vaccineName: { type: DataTypes.STRING(100), allowNull: false, validate: { notEmpty: { msg: 'Vaccine name is required' } } },
      dateGiven: { type: DataTypes.DATEONLY, allowNull: false, validate: { isDate: { msg: 'dateGiven must be a valid date' } } },
      nextDueDate: { type: DataTypes.DATEONLY, allowNull: true, validate: { isDate: { msg: 'nextDueDate must be a valid date' } } },
      batchNo: { type: DataTypes.STRING(50), allowNull: true },
      notes: { type: DataTypes.TEXT, allowNull: true },
      petId: { type: DataTypes.INTEGER, allowNull: false },
      vetId: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      validate: {
        // custom model-level validator
        dueAfterGiven() {
          if (this.nextDueDate && this.dateGiven && new Date(this.nextDueDate) <= new Date(this.dateGiven)) {
            throw new Error('nextDueDate must be after dateGiven');
          }
        },
      },
    }
  );
  return VaccinationLog;
};
