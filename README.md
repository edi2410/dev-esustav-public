# eSustav

Sustav za upravljanje studentskom organizacijom.

## Sadržaj
- [Preduvjeti](#preduvjeti)
- [Lokalno Pokretanje](#lokalno-pokretanje)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Docker Pokretanje](#docker-pokretanje)
- [Dokumentacija](#dokumentacija)

---

## Preduvjeti

### Za lokalni razvoj
- [Python 3.10+](https://www.python.org/downloads/)
- [pip](https://pip.pypa.io/en/stable/installation/)
- [Node.js 18+](https://nodejs.org/en/download/)
- [PostgreSQL](https://www.postgresql.org/download/) (ili SQLite za razvoj)

### Za Docker
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

---

## Lokalno Pokretanje

### Backend

1. **Pozicioniraj se u backend folder:**
   ```bash
   cd backend
   ```

2. **Kreiraj virtualni environment:**
   ```bash
   python -m venv env
   ```

3. **Aktiviraj environment:**

   **Windows:**
   ```bash
   .\env\Scripts\activate
   ```

   **macOS/Linux:**
   ```bash
   source ./env/bin/activate
   ```

4. **Instaliraj dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Konfiguriraj .env datoteku:**

   Kreiraj ili uredi `backend/.env`:
   ```env
   DEBUG=True
   SECRET_KEY=your-secret-key-here

   # Google OAuth
   GOOGLE_SCOPE_ID=your-google-client-id
   GOOGLE_SECRET=your-google-secret

   # Database (lokalno)
   DATABASE_NAME=esustav
   DATABASE_USER=admin
   DATABASE_PASSWORD=your-password
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   ```

6. **Pokreni migracije:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

7. **Kreiraj superuser-a (opcionalno):**
   ```bash
   python manage.py createsuperuser
   ```

8. **Pokreni razvojni server:**
   ```bash
   python manage.py runserver
   ```

   Backend je dostupan na: `http://localhost:8000`

### Frontend

1. **Pozicioniraj se u frontend folder:**
   ```bash
   cd frontend
   ```

2. **Instaliraj dependencies:**
   ```bash
   npm install
   ```

3. **Konfiguriraj .env datoteku:**

   Kreiraj ili uredi `frontend/.env`:
   ```env
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   ```

4. **Pokreni razvojni server:**
   ```bash
   npm start
   ```

   Frontend je dostupan na: `http://localhost:5173`

---

## Docker Pokretanje

### Brzi start

1. **Konfiguriraj environment varijable:**

   Uredi `.env` u root folderu:
   ```env
   # Database
   POSTGRES_DB_HOST=esustav_db
   POSTGRES_DB=esustav
   POSTGRES_USER=admin
   POSTGRES_PASSWORD=your-secure-password
   POSTGRES_PORT=5432
   ```

   Uredi `backend/.env`:
   ```env
   DEBUG=False
   SECRET_KEY=your-production-secret-key

   GOOGLE_SCOPE_ID=your-google-client-id
   GOOGLE_SECRET=your-google-secret

   DATABASE_NAME=esustav
   DATABASE_USER=admin
   DATABASE_PASSWORD=your-secure-password
   DATABASE_HOST=esustav_db
   DATABASE_PORT=5432

   CACHES_URL=esustav_memcached:11211
   ```

2. **Pokreni sve servise:**
   ```bash
   docker-compose up --build
   ```

3. **Pristup aplikaciji:**
   - Aplikacija: `http://localhost:8700`
   - API: `http://localhost:8700/api`

### Docker Servisi

| Servis | Opis | Port |
|--------|------|------|
| `esustav_nginx` | Nginx reverse proxy | 8700 |
| `esustav_api` | Django backend | 8000 (interno) |
| `esustav_fe` | React frontend | 5173 (interno) |
| `esustav_db` | PostgreSQL baza | 5432 (interno) |

### Docker Naredbe

```bash
# Pokretanje u pozadini
docker-compose up -d

# Zaustavljanje servisa
docker-compose down

# Rebuild nakon promjena
docker-compose up --build

# Pregled logova
docker-compose logs -f

# Pregled logova specifičnog servisa
docker-compose logs -f esustav_api

# Pristup bazi
docker exec -it esustav_db psql -U admin -d esustav

# Pokretanje migracija ručno
docker exec -it esustav_api python manage.py migrate

# Kreiranje superuser-a u Dockeru
docker exec -it esustav_api python manage.py createsuperuser
```

### Struktura Docker Compose

```
docker-compose.yaml
├── esustav_nginx     # Reverse proxy (port 8700)
│   └── depends_on: esustav_fe, esustav_db
├── esustav_api       # Django backend
│   └── depends_on: esustav_db
├── esustav_fe        # React frontend
└── esustav_db        # PostgreSQL
```

---

## Dokumentacija

- [Podatkovni Model](docs/PODATKOVNI_MODEL.md) - Detaljni opis arhitekture podataka (backend)
- [Frontend Arhitektura](docs/FRONTEND_ARHITEKTURA.md) - Arhitektura i struktura frontenda
- [Uloge i Dozvole](docs/ULOGE_I_DOZVOLE.md) - Sustav uloga i permisija
- [Environment Varijable](docs/ENV_VARIJABLE.md) - Konfiguracija environment varijabli
- [Lokalna Baza](docs/LOKALNA_BAZA.md) - Docker PostgreSQL setup i SQL import
- [Vodič za Doprinos](CONTRIBUTING.md) - Upute za nove developere

---

## Razvoj

### Struktura Projekta

```
esustav/
├── backend/                 # Django backend
│   ├── estudenti/          # Glavni modul - korisnici i uloge
│   ├── eaktivnosti/        # Modul aktivnosti
│   ├── einfo/              # Info i certifikati
│   ├── eizbori/            # Izbori
│   ├── epartneri/          # Partneri
│   ├── suprach/            # Peer review
│   ├── logs/               # Logging
│   └── settings/           # Django konfiguracija
├── frontend/               # React frontend
├── nginx/                  # Nginx konfiguracija
├── docs/                   # Dokumentacija
└── docker-compose.yaml     # Docker Compose konfiguracija
```

### Korisni Linkovi

- Django Admin: `http://localhost:8000/admin` (lokalno) ili `http://localhost:8700/admin` (Docker)
- API Dokumentacija: `http://localhost:8000/api/` (lokalno) ili `http://localhost:8700/api` (Docker)
