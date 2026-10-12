# 🐾 Veterinary Clinic & Pet Medical History System

Full Stack mini project — **ISA-II** (Node/Express/Sequelize/MySQL API in `/server`) + **ISA-III** (React client in `/client`).

## Run it
```bash
# 1. Backend  (MySQL must be running, e.g. via XAMPP)
cd server
npm install
# edit .env -> DB_USER / DB_PASSWORD
npm run db:setup      # create DB + migrate + seed
npm run dev           # http://localhost:5000

# 2. Frontend (new terminal)
cd client
npm install
npm run dev           # http://localhost:5173  (proxies /api to :5000)
```
API documentation: see `server/README.md`.

## Rubric mapping
| Requirement | Where |
|---|---|
| DB connection + migrations | `server/config`, `server/models/index.js`, `server/migrations`, `server/seeders` |
| 1:M associations | `server/models/index.js` (Owner→Pet, Pet→Vaccination, Pet→Visit, Vet→…) |
| Validations/constraints | `server/models/*.js` (unique email, regex phone, ENUM, custom validators) |
| CRUD with finders | `server/controllers/*` (findAll, findByPk, findAndCountAll, create, update, destroy) |
| Raw SQL / advanced filtering | `reportController.js` (raw SQL), `petController.getAll` (filters + pagination) |
| Components + props + routing | `client/src/components`, `client/src/pages`, `App.jsx` |
| useState / useEffect / useContext+useReducer | all pages; `context/ClinicContext.jsx` |
| useRef / useMemo / useCallback / memo | `SearchBar`, `Owners`, `Pets`, `PetCard` |
