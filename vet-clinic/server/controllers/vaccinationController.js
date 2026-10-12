const { VaccinationLog, Pet, Veterinarian } = require('../models');

exports.getByPet = async (req, res) => {
  const pet = await Pet.findByPk(req.params.petId);
  if (!pet) return res.status(404).json({ message: 'Pet not found' });
  const logs = await VaccinationLog.findAll({
    where: { petId: pet.id },
    include: [{ model: Veterinarian, as: 'vet', attributes: ['id', 'name'] }],
    order: [['dateGiven', 'DESC']],
  });
  res.json(logs);
};

exports.create = async (req, res) => {
  const pet = await Pet.findByPk(req.params.petId);
  if (!pet) return res.status(404).json({ message: 'Pet not found' });
  const { vaccineName, dateGiven, nextDueDate, batchNo, notes, vetId } = req.body;
  const log = await VaccinationLog.create({
    vaccineName, dateGiven, nextDueDate: nextDueDate || null, batchNo, notes, vetId: vetId || null, petId: pet.id,
  });
  res.status(201).json(log);
};

exports.update = async (req, res) => {
  const log = await VaccinationLog.findByPk(req.params.id);
  if (!log) return res.status(404).json({ message: 'Vaccination record not found' });
  const { vaccineName, dateGiven, nextDueDate, batchNo, notes, vetId } = req.body;
  await log.update({ vaccineName, dateGiven, nextDueDate: nextDueDate || null, batchNo, notes, vetId: vetId || null });
  res.json(log);
};

exports.remove = async (req, res) => {
  const log = await VaccinationLog.findByPk(req.params.id);
  if (!log) return res.status(404).json({ message: 'Vaccination record not found' });
  await log.destroy();
  res.json({ message: 'Vaccination record deleted' });
};
