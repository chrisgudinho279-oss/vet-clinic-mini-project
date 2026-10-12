const { Op } = require('sequelize');
const { Pet, Owner, VaccinationLog, Visit, Veterinarian } = require('../models');

// GET /api/pets?species=Dog&ownerId=1&search=bru&gender=Male&page=1&limit=10&sort=name&order=ASC
exports.getAll = async (req, res) => {
  const { species, ownerId, search, gender } = req.query;
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
  const sortable = ['name', 'species', 'dateOfBirth', 'weight', 'createdAt'];
  const sort = sortable.includes(req.query.sort) ? req.query.sort : 'name';
  const order = String(req.query.order).toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  const where = {};
  if (species) where.species = species;
  if (gender) where.gender = gender;
  if (ownerId) where.ownerId = ownerId;
  if (search) where[Op.or] = [{ name: { [Op.like]: `%${search}%` } }, { breed: { [Op.like]: `%${search}%` } }];

  const { count, rows } = await Pet.findAndCountAll({
    where,
    include: [{ model: Owner, as: 'owner', attributes: ['id', 'name', 'phone'] }],
    order: [[sort, order]],
    limit,
    offset: (page - 1) * limit,
  });

  res.json({ total: count, page, pages: Math.ceil(count / limit), data: rows });
};

exports.getOne = async (req, res) => {
  const pet = await Pet.findByPk(req.params.id, { include: [{ model: Owner, as: 'owner' }] });
  if (!pet) return res.status(404).json({ message: 'Pet not found' });
  res.json(pet);
};

// GET /api/pets/:id/history  -> full medical history in a single call
exports.getHistory = async (req, res) => {
  const pet = await Pet.findByPk(req.params.id, {
    include: [
      { model: Owner, as: 'owner' },
      { model: VaccinationLog, as: 'vaccinations', include: [{ model: Veterinarian, as: 'vet', attributes: ['id', 'name'] }] },
      { model: Visit, as: 'visits', include: [{ model: Veterinarian, as: 'vet', attributes: ['id', 'name'] }] },
    ],
    order: [
      [{ model: VaccinationLog, as: 'vaccinations' }, 'dateGiven', 'DESC'],
      [{ model: Visit, as: 'visits' }, 'visitDate', 'DESC'],
    ],
  });
  if (!pet) return res.status(404).json({ message: 'Pet not found' });
  res.json(pet);
};

exports.create = async (req, res) => {
  const { name, species, breed, gender, dateOfBirth, weight, ownerId } = req.body;
  const owner = await Owner.findByPk(ownerId);
  if (!owner) return res.status(400).json({ message: 'Validation failed', errors: ['Owner does not exist'] });
  const pet = await Pet.create({ name, species, breed, gender, dateOfBirth: dateOfBirth || null, weight: weight || null, ownerId });
  res.status(201).json(pet);
};

exports.update = async (req, res) => {
  const pet = await Pet.findByPk(req.params.id);
  if (!pet) return res.status(404).json({ message: 'Pet not found' });
  const { name, species, breed, gender, dateOfBirth, weight, ownerId } = req.body;
  await pet.update({ name, species, breed, gender, dateOfBirth: dateOfBirth || null, weight: weight || null, ownerId });
  res.json(pet);
};

exports.remove = async (req, res) => {
  const pet = await Pet.findByPk(req.params.id);
  if (!pet) return res.status(404).json({ message: 'Pet not found' });
  await pet.destroy();
  res.json({ message: 'Pet deleted' });
};
