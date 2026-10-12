const { Op } = require('sequelize');
const { Owner, Pet } = require('../models');

exports.getAll = async (req, res) => {
  const { search } = req.query;
  const where = search
    ? { [Op.or]: [{ name: { [Op.like]: `%${search}%` } }, { email: { [Op.like]: `%${search}%` } }, { phone: { [Op.like]: `%${search}%` } }] }
    : {};
  const owners = await Owner.findAll({ where, include: [{ model: Pet, as: 'pets', attributes: ['id', 'name', 'species'] }], order: [['name', 'ASC']] });
  res.json(owners);
};

exports.getOne = async (req, res) => {
  const owner = await Owner.findByPk(req.params.id, { include: [{ model: Pet, as: 'pets' }] });
  if (!owner) return res.status(404).json({ message: 'Owner not found' });
  res.json(owner);
};

exports.create = async (req, res) => {
  const { name, email, phone, address } = req.body;
  const owner = await Owner.create({ name, email, phone, address });
  res.status(201).json(owner);
};

exports.update = async (req, res) => {
  const owner = await Owner.findByPk(req.params.id);
  if (!owner) return res.status(404).json({ message: 'Owner not found' });
  const { name, email, phone, address } = req.body;
  await owner.update({ name, email, phone, address });
  res.json(owner);
};

exports.remove = async (req, res) => {
  const owner = await Owner.findByPk(req.params.id);
  if (!owner) return res.status(404).json({ message: 'Owner not found' });
  await owner.destroy(); // pets, vaccinations and visits are removed by ON DELETE CASCADE
  res.json({ message: 'Owner and all related pets deleted' });
};
