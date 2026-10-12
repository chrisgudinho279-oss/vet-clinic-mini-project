const { Visit, Pet, Veterinarian } = require('../models');

exports.getByPet = async (req, res) => {
  const pet = await Pet.findByPk(req.params.petId);
  if (!pet) return res.status(404).json({ message: 'Pet not found' });
  const visits = await Visit.findAll({
    where: { petId: pet.id },
    include: [{ model: Veterinarian, as: 'vet', attributes: ['id', 'name'] }],
    order: [['visitDate', 'DESC']],
  });
  res.json(visits);
};

exports.create = async (req, res) => {
  const pet = await Pet.findByPk(req.params.petId);
  if (!pet) return res.status(404).json({ message: 'Pet not found' });
  const { visitDate, symptoms, diagnosis, treatment, vetId } = req.body;
  const visit = await Visit.create({ visitDate, symptoms, diagnosis, treatment, vetId: vetId || null, petId: pet.id });
  res.status(201).json(visit);
};

exports.update = async (req, res) => {
  const visit = await Visit.findByPk(req.params.id);
  if (!visit) return res.status(404).json({ message: 'Visit not found' });
  const { visitDate, symptoms, diagnosis, treatment, vetId } = req.body;
  await visit.update({ visitDate, symptoms, diagnosis, treatment, vetId: vetId || null });
  res.json(visit);
};

exports.remove = async (req, res) => {
  const visit = await Visit.findByPk(req.params.id);
  if (!visit) return res.status(404).json({ message: 'Visit not found' });
  await visit.destroy();
  res.json({ message: 'Visit deleted' });
};
