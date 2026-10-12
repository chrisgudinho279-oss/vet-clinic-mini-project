# Vet Clinic & Pet Medical History System — REST API (ISA-II)

Node.js + Express + Sequelize ORM + MySQL.

## Setup
```bash
cd server
npm install
cp .env.example .env        # then edit DB_USER / DB_PASSWORD
npm run db:setup            # create database + run migration + seed demo data
npm run dev                 # http://localhost:5000
```
`npm run db:reset` drops all tables, re-migrates and re-seeds.

## Folder structure
`/config` DB config · `/models` Sequelize models + associations · `/migrations` · `/seeders` · `/controllers` · `/routes` · `/middleware` (error handling)

## Associations (all 1:M)
| Parent | Child | Alias | On delete |
|---|---|---|---|
| Owner | Pet | `pets` | CASCADE |
| Pet | VaccinationLog | `vaccinations` | CASCADE |
| Pet | Visit | `visits` | CASCADE |
| Veterinarian | VaccinationLog / Visit | `vaccinations` / `visits` | SET NULL |

## Validations
- Owner: name required, email unique + valid, phone regex `7-15 digits`
- Pet: species ENUM, dateOfBirth not in future (custom), weight > 0, ownerId must exist
- VaccinationLog: vaccineName/dateGiven required, `nextDueDate` must be after `dateGiven` (custom model-level validator)
- Veterinarian: email unique + valid

## Status codes
`200` OK · `201` Created · `400` Validation error · `404` Not found · `409` Duplicate (unique) · `500` Server error

Error body: `{ "message": "Validation failed", "errors": ["Enter a valid email address"] }`

## Endpoints
| Method | URL | Description |
|---|---|---|
| GET | `/api/owners?search=` | List owners (with pets), optional search |
| POST | `/api/owners` | Create owner |
| GET | `/api/owners/:id` | Owner with pets |
| PUT | `/api/owners/:id` | Update owner |
| DELETE | `/api/owners/:id` | Delete owner (cascades) |
| GET | `/api/pets?species=&gender=&ownerId=&search=&page=&limit=&sort=&order=` | **Advanced filtering + pagination** |
| POST | `/api/pets` | Create pet |
| GET | `/api/pets/:id` | Pet with owner |
| GET | `/api/pets/:id/history` | Pet + owner + all vaccinations + all visits |
| PUT | `/api/pets/:id` | Update pet |
| DELETE | `/api/pets/:id` | Delete pet |
| GET | `/api/pets/:petId/vaccinations` | Vaccination log of a pet |
| POST | `/api/pets/:petId/vaccinations` | Add vaccination |
| PUT / DELETE | `/api/vaccinations/:id` | Update / delete vaccination |
| GET | `/api/pets/:petId/visits` | Visits of a pet |
| POST | `/api/pets/:petId/visits` | Add visit |
| PUT / DELETE | `/api/visits/:id` | Update / delete visit |
| GET / POST | `/api/vets` | List / create veterinarians |
| GET | `/api/reports/vaccinations-due?days=30&includeOverdue=true` | **Raw SQL** report: vaccinations due soon with pet + owner contact |
| GET | `/api/reports/summary` | **Raw SQL** dashboard counts |

## Example payloads
**POST /api/owners**
```json
{ "name": "Priya Shet", "email": "priya@example.com", "phone": "9822000111", "address": "Vasco, Goa" }
```
**POST /api/pets**
```json
{ "name": "Tommy", "species": "Dog", "breed": "Pug", "gender": "Male", "dateOfBirth": "2022-05-10", "weight": 8.4, "ownerId": 1 }
```
**POST /api/pets/1/vaccinations**
```json
{ "vaccineName": "Rabies", "dateGiven": "2026-10-01", "nextDueDate": "2027-10-01", "batchNo": "RB-3001", "vetId": 1 }
```
**POST /api/pets/1/visits**
```json
{ "visitDate": "2026-10-09", "symptoms": "Loss of appetite", "diagnosis": "Mild gastritis", "treatment": "Diet change + antacid", "vetId": 2 }
```
**Validation failure → 400**
```json
{ "message": "Validation failed", "errors": ["nextDueDate must be after dateGiven"] }
```
