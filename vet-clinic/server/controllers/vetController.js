const { Veterinarian } = require('../models');

exports.getAll = async (req, res) => {
  res.json(await Veterinarian.findAll({ order: [['name', 'ASC']] }));
};

exports.create = async (req, res) => {
  const { name, specialization, email } = req.body;
  res.status(201).json(await Veterinarian.create({ name, specialization, email }));
};
