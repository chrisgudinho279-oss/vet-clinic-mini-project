'use strict';

const ts = (Sequelize) => ({
  createdAt: { allowNull: false, type: Sequelize.DATE },
  updatedAt: { allowNull: false, type: Sequelize.DATE },
});
const id = (Sequelize) => ({ id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER } });

const fk = (Sequelize, model, { allowNull, onDelete }) => ({
  type: Sequelize.INTEGER,
  allowNull,
  references: { model, key: 'id' },
  onDelete,
  onUpdate: 'CASCADE',
});

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Owners', {
      ...id(Sequelize),
      name: { type: Sequelize.STRING(100), allowNull: false },
      email: { type: Sequelize.STRING(120), allowNull: false, unique: true },
      phone: { type: Sequelize.STRING(15), allowNull: false },
      address: { type: Sequelize.STRING(255) },
      ...ts(Sequelize),
    });

    await queryInterface.createTable('Veterinarians', {
      ...id(Sequelize),
      name: { type: Sequelize.STRING(100), allowNull: false },
      specialization: { type: Sequelize.STRING(100) },
      email: { type: Sequelize.STRING(120), allowNull: false, unique: true },
      ...ts(Sequelize),
    });

    await queryInterface.createTable('Pets', {
      ...id(Sequelize),
      name: { type: Sequelize.STRING(80), allowNull: false },
      species: { type: Sequelize.ENUM('Dog', 'Cat', 'Bird', 'Rabbit', 'Other'), allowNull: false },
      breed: { type: Sequelize.STRING(80) },
      gender: { type: Sequelize.ENUM('Male', 'Female'), allowNull: false, defaultValue: 'Male' },
      dateOfBirth: { type: Sequelize.DATEONLY },
      weight: { type: Sequelize.DECIMAL(5, 2) },
      ownerId: fk(Sequelize, 'Owners', { allowNull: false, onDelete: 'CASCADE' }),
      ...ts(Sequelize),
    });

    await queryInterface.createTable('VaccinationLogs', {
      ...id(Sequelize),
      vaccineName: { type: Sequelize.STRING(100), allowNull: false },
      dateGiven: { type: Sequelize.DATEONLY, allowNull: false },
      nextDueDate: { type: Sequelize.DATEONLY },
      batchNo: { type: Sequelize.STRING(50) },
      notes: { type: Sequelize.TEXT },
      petId: fk(Sequelize, 'Pets', { allowNull: false, onDelete: 'CASCADE' }),
      vetId: fk(Sequelize, 'Veterinarians', { allowNull: true, onDelete: 'SET NULL' }),
      ...ts(Sequelize),
    });

    await queryInterface.createTable('Visits', {
      ...id(Sequelize),
      visitDate: { type: Sequelize.DATEONLY, allowNull: false },
      symptoms: { type: Sequelize.TEXT },
      diagnosis: { type: Sequelize.TEXT },
      treatment: { type: Sequelize.TEXT },
      petId: fk(Sequelize, 'Pets', { allowNull: false, onDelete: 'CASCADE' }),
      vetId: fk(Sequelize, 'Veterinarians', { allowNull: true, onDelete: 'SET NULL' }),
      ...ts(Sequelize),
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Visits');
    await queryInterface.dropTable('VaccinationLogs');
    await queryInterface.dropTable('Pets');
    await queryInterface.dropTable('Veterinarians');
    await queryInterface.dropTable('Owners');
  },
};
