const router = require('express').Router();
const h = require('../middleware/asyncHandler');
const owner = require('../controllers/ownerController');
const pet = require('../controllers/petController');
const vacc = require('../controllers/vaccinationController');
const visit = require('../controllers/visitController');
const vet = require('../controllers/vetController');
const report = require('../controllers/reportController');

// Owners
router.get('/owners', h(owner.getAll));
router.post('/owners', h(owner.create));
router.get('/owners/:id', h(owner.getOne));
router.put('/owners/:id', h(owner.update));
router.delete('/owners/:id', h(owner.remove));

// Pets
router.get('/pets', h(pet.getAll));
router.post('/pets', h(pet.create));
router.get('/pets/:id', h(pet.getOne));
router.get('/pets/:id/history', h(pet.getHistory));
router.put('/pets/:id', h(pet.update));
router.delete('/pets/:id', h(pet.remove));

// Vaccinations
router.get('/pets/:petId/vaccinations', h(vacc.getByPet));
router.post('/pets/:petId/vaccinations', h(vacc.create));
router.put('/vaccinations/:id', h(vacc.update));
router.delete('/vaccinations/:id', h(vacc.remove));

// Visits
router.get('/pets/:petId/visits', h(visit.getByPet));
router.post('/pets/:petId/visits', h(visit.create));
router.put('/visits/:id', h(visit.update));
router.delete('/visits/:id', h(visit.remove));

// Vets
router.get('/vets', h(vet.getAll));
router.post('/vets', h(vet.create));

// Reports (raw SQL)
router.get('/reports/vaccinations-due', h(report.vaccinationsDue));
router.get('/reports/summary', h(report.summary));

module.exports = router;
