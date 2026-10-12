const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');

// GET /api/reports/vaccinations-due?days=30
// Raw SQL: upcoming vaccinations (and overdue ones when includeOverdue=true) with pet + owner contact details
exports.vaccinationsDue = async (req, res) => {
  const days = Math.min(Math.max(parseInt(req.query.days, 10) || 30, 1), 365);
  const includeOverdue = req.query.includeOverdue === 'true';

  const sql = `
    SELECT p.id AS petId, p.name AS petName, p.species,
           o.id AS ownerId, o.name AS ownerName, o.phone AS ownerPhone,
           v.id AS vaccinationId, v.vaccineName, v.nextDueDate,
           DATEDIFF(v.nextDueDate, CURDATE()) AS daysLeft
    FROM VaccinationLogs v
    JOIN Pets p ON p.id = v.petId
    JOIN Owners o ON o.id = p.ownerId
    WHERE v.nextDueDate <= DATE_ADD(CURDATE(), INTERVAL :days DAY)
      AND (:includeOverdue = 1 OR v.nextDueDate >= CURDATE())
    ORDER BY v.nextDueDate ASC`;

  const rows = await sequelize.query(sql, {
    replacements: { days, includeOverdue: includeOverdue ? 1 : 0 },
    type: QueryTypes.SELECT,
  });
  res.json({ days, includeOverdue, count: rows.length, data: rows });
};

// GET /api/reports/summary  -> counts for the dashboard (raw SQL)
exports.summary = async (req, res) => {
  const [row] = await sequelize.query(
    `SELECT (SELECT COUNT(*) FROM Owners) AS owners,
            (SELECT COUNT(*) FROM Pets) AS pets,
            (SELECT COUNT(*) FROM VaccinationLogs) AS vaccinations,
            (SELECT COUNT(*) FROM Visits) AS visits`,
    { type: QueryTypes.SELECT }
  );
  res.json(row);
};
