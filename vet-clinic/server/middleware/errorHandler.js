// Central error handler: converts Sequelize errors into clean HTTP responses
module.exports = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({ message: 'Validation failed', errors: err.errors.map((e) => e.message) });
  }
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ message: 'Duplicate value', errors: err.errors.map((e) => e.message) });
  }
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({ message: 'Invalid reference', errors: ['Related record (owner / pet / vet) does not exist'] });
  }
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
};
