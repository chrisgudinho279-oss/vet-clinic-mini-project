'use strict';

// helper: YYYY-MM-DD, offset by N days from today
const day = (offset) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
};

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const t = { createdAt: now, updatedAt: now };

    await queryInterface.bulkInsert('Owners', [
      { id: 1, name: 'Rohan Naik', email: 'rohan.naik@example.com', phone: '9822012345', address: 'Margao, Goa', ...t },
      { id: 2, name: 'Sneha Fernandes', email: 'sneha.f@example.com', phone: '9876543210', address: 'Panaji, Goa', ...t },
      { id: 3, name: 'Amit Desai', email: 'amit.desai@example.com', phone: '9765432101', address: 'Ponda, Goa', ...t },
    ]);

    await queryInterface.bulkInsert('Veterinarians', [
      { id: 1, name: 'Dr. Meera Kamat', specialization: 'Small Animals', email: 'meera.kamat@vetclinic.com', ...t },
      { id: 2, name: 'Dr. Joseph Pereira', specialization: 'Surgery', email: 'joseph.p@vetclinic.com', ...t },
    ]);

    await queryInterface.bulkInsert('Pets', [
      { id: 1, name: 'Bruno', species: 'Dog', breed: 'Labrador', gender: 'Male', dateOfBirth: '2021-03-14', weight: 28.5, ownerId: 1, ...t },
      { id: 2, name: 'Misty', species: 'Cat', breed: 'Persian', gender: 'Female', dateOfBirth: '2022-07-02', weight: 4.2, ownerId: 1, ...t },
      { id: 3, name: 'Coco', species: 'Dog', breed: 'Beagle', gender: 'Female', dateOfBirth: '2020-11-23', weight: 11.0, ownerId: 2, ...t },
      { id: 4, name: 'Kiwi', species: 'Bird', breed: 'Parrot', gender: 'Male', dateOfBirth: '2023-01-10', weight: 0.35, ownerId: 3, ...t },
    ]);

    await queryInterface.bulkInsert('VaccinationLogs', [
      { vaccineName: 'Rabies', dateGiven: day(-340), nextDueDate: day(10), batchNo: 'RB-2291', notes: 'Annual booster', petId: 1, vetId: 1, ...t },
      { vaccineName: 'DHPP', dateGiven: day(-300), nextDueDate: day(25), batchNo: 'DH-1180', notes: null, petId: 1, vetId: 1, ...t },
      { vaccineName: 'FVRCP', dateGiven: day(-350), nextDueDate: day(15), batchNo: 'FV-0771', notes: null, petId: 2, vetId: 2, ...t },
      { vaccineName: 'Rabies', dateGiven: day(-100), nextDueDate: day(265), batchNo: 'RB-2310', notes: null, petId: 3, vetId: 1, ...t },
      { vaccineName: 'Leptospirosis', dateGiven: day(-380), nextDueDate: day(-15), batchNo: 'LP-0042', notes: 'Overdue - remind owner', petId: 3, vetId: 2, ...t },
    ]);

    await queryInterface.bulkInsert('Visits', [
      { visitDate: day(-60), symptoms: 'Limping on right hind leg', diagnosis: 'Mild sprain', treatment: 'Rest and anti-inflammatory for 5 days', petId: 1, vetId: 2, ...t },
      { visitDate: day(-20), symptoms: 'Sneezing, watery eyes', diagnosis: 'Upper respiratory infection', treatment: 'Antibiotic course (7 days)', petId: 2, vetId: 1, ...t },
      { visitDate: day(-5), symptoms: 'Routine check-up', diagnosis: 'Healthy', treatment: 'None', petId: 3, vetId: 1, ...t },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Visits', null, {});
    await queryInterface.bulkDelete('VaccinationLogs', null, {});
    await queryInterface.bulkDelete('Pets', null, {});
    await queryInterface.bulkDelete('Veterinarians', null, {});
    await queryInterface.bulkDelete('Owners', null, {});
  },
};
