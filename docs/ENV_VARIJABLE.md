# Environment Varijable - eSustav

Ovaj dokument sadrži sve environment varijable potrebne za pokretanje eSustav aplikacije.

## Sadržaj
- [Pregled](#pregled)
- [Backend Varijable](#backend-varijable)
- [Frontend Varijable](#frontend-varijable)
- [Docker Compose Varijable](#docker-compose-varijable)
- [Primjeri Konfiguracija](#primjeri-konfiguracija)

---

## Pregled

Aplikacija koristi tri `.env` datoteke:

| Datoteka | Lokacija | Namjena |
|----------|----------|---------|
| `.env` | `/` (root) | Docker Compose - PostgreSQL konfiguracija |
| `.env` | `/backend/` | Django backend konfiguracija |
| `.env` | `/frontend/` | React frontend konfiguracija |

---

## Backend Varijable

**Lokacija:** `backend/.env`

### Django Konfiguracija

| Varijabla | Opis | Primjer | Obavezno |
|-----------|------|---------|:--------:|
| `DEBUG` | Debug mode (True/False) | `True` | ✓ |
| `SECRET_KEY` | Django secret key | `django-insecure-...` | ✓ |

### Google OAuth

| Varijabla | Opis | Primjer | Obavezno |
|-----------|------|---------|:--------:|
| `GOOGLE_SCOPE_ID` | Google OAuth Client ID | `123456789-xxx.apps.googleusercontent.com` | ✓ |
| `GOOGLE_SECRET` | Google OAuth Client Secret | `GOCSPX-...` | ✓ |

### Baza Podataka

| Varijabla | Opis | Primjer (Lokalno) | Primjer (Docker) | Obavezno |
|-----------|------|-------------------|------------------|:--------:|
| `DATABASE_NAME` | Naziv baze | `esustav` | `esustav` | ✓ |
| `DATABASE_USER` | Korisnik baze | `admin` | `admin` | ✓ |
| `DATABASE_PASSWORD` | Lozinka baze | `your-password` | `your-password` | ✓ |
| `DATABASE_HOST` | Host baze | `localhost` | `esustav_db` | ✓ |
| `DATABASE_PORT` | Port baze | `5432` | `5432` | ✓ |

### Cache

| Varijabla | Opis | Primjer | Obavezno |
|-----------|------|---------|:--------:|
| `CACHES_URL` | Memcached URL | `esustav_memcached:11211` | ✗ |

---

## Frontend Varijable

**Lokacija:** `frontend/.env`

| Varijabla | Opis | Primjer | Obavezno |
|-----------|------|---------|:--------:|
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID | `123456789-xxx.apps.googleusercontent.com` | ✓ |

> **Napomena:** Vite zahtijeva `VITE_` prefix za varijable dostupne u kodu.

### Pristup u Kodu

```typescript
// Frontend - pristup environment varijabli
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
```

---

## Docker Compose Varijable

**Lokacija:** `.env` (root folder)

| Varijabla | Opis | Primjer | Obavezno |
|-----------|------|---------|:--------:|
| `POSTGRES_DB_HOST` | Naziv Docker kontejnera za bazu | `esustav_db` | ✓ |
| `POSTGRES_DB` | Naziv baze podataka | `esustav` | ✓ |
| `POSTGRES_USER` | Korisnik PostgreSQL-a | `admin` | ✓ |
| `POSTGRES_PASSWORD` | Lozinka PostgreSQL-a | `your-password` | ✓ |
| `POSTGRES_PORT` | Port PostgreSQL-a | `5432` | ✓ |

---

## Primjeri Konfiguracija

### Lokalni Razvoj

#### `backend/.env`
```env
# Django
DEBUG=True
SECRET_KEY=django-insecure-your-development-secret-key-here

# Google OAuth
GOOGLE_SCOPE_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_SECRET=your-google-secret

# Database (lokalni PostgreSQL)
DATABASE_NAME=esustav
DATABASE_USER=postgres
DATABASE_PASSWORD=your-local-password
DATABASE_HOST=localhost
DATABASE_PORT=5432
```

#### `frontend/.env`
```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

---

### Docker Development

#### `.env` (root)
```env
# PostgreSQL Docker kontejner
POSTGRES_DB_HOST=esustav_db
POSTGRES_DB=esustav
POSTGRES_USER=admin
POSTGRES_PASSWORD=secure-docker-password
POSTGRES_PORT=5432
```

#### `backend/.env`
```env
# Django
DEBUG=True
SECRET_KEY=django-insecure-your-docker-dev-secret-key

# Google OAuth
GOOGLE_SCOPE_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_SECRET=your-google-secret

# Database (Docker kontejner)
DATABASE_NAME=esustav
DATABASE_USER=admin
DATABASE_PASSWORD=secure-docker-password
DATABASE_HOST=esustav_db
DATABASE_PORT=5432

# Cache
CACHES_URL=esustav_memcached:11211
```

#### `frontend/.env`
```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

---

### Produkcija

#### `.env` (root)
```env
POSTGRES_DB_HOST=esustav_db
POSTGRES_DB=esustav
POSTGRES_USER=admin
POSTGRES_PASSWORD=very-secure-production-password-123!
POSTGRES_PORT=5432
```

#### `backend/.env`
```env
# Django - PRODUKCIJA
DEBUG=False
SECRET_KEY=your-very-long-and-secure-production-secret-key-min-50-chars

# Google OAuth
GOOGLE_SCOPE_ID=your-production-google-client-id.apps.googleusercontent.com
GOOGLE_SECRET=your-production-google-secret

# Database
DATABASE_NAME=esustav
DATABASE_USER=admin
DATABASE_PASSWORD=very-secure-production-password-123!
DATABASE_HOST=esustav_db
DATABASE_PORT=5432

# Cache
CACHES_URL=esustav_memcached:11211
```

#### `frontend/.env`
```env
VITE_GOOGLE_CLIENT_ID=your-production-google-client-id.apps.googleusercontent.com
```

---

## Sigurnosne Napomene

### Nikad ne commitaj `.env` datoteke

Dodaj u `.gitignore`:
```gitignore
.env
backend/.env
frontend/.env
```

### Produkcijski SECRET_KEY

- Mora biti **unikatan** i **složen**
- Minimalno 50 znakova
- Generiraj pomoću:
  ```bash
  python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
  ```

### DEBUG u Produkciji

- **Uvijek** postavi `DEBUG=False` u produkciji
- Debug mode izlaže osjetljive informacije

### Lozinke Baze

- Koristi jake lozinke (min. 16 znakova)
- Kombinacija slova, brojeva i specijalnih znakova
- Različite lozinke za development i produkciju

---

## Google OAuth Konfiguracija

### Dobivanje Credentials

1. Idi na [Google Cloud Console](https://console.cloud.google.com/)
2. Kreiraj novi projekt ili odaberi postojeći
3. Idi na **APIs & Services** → **Credentials**
4. Klikni **Create Credentials** → **OAuth 2.0 Client IDs**
5. Odaberi **Web application**
6. Dodaj **Authorized JavaScript origins**:
   - `http://localhost:5173` (lokalni razvoj)
   - `http://localhost:3000` (alternativni port)
   - `https://esustav.estudent.hr` (produkcija)
7. Dodaj **Authorized redirect URIs** ako je potrebno
8. Kopiraj **Client ID** i **Client Secret**

### Provjera Konfiguracije

```bash
# Backend - provjeri jesu li varijable učitane
cd backend
python manage.py shell
>>> from django.conf import settings
>>> print(settings.GOOGLE_SCOPE_ID)
```

---

## Troubleshooting

### Varijable se ne učitavaju

1. Provjeri postoji li `.env` datoteka
2. Provjeri nema li razmaka oko `=` znaka
3. Provjeri encoding datoteke (UTF-8)

### Database Connection Error

1. Provjeri `DATABASE_HOST`:
   - Lokalno: `localhost`
   - Docker: `esustav_db` (ime servisa)
2. Provjeri je li PostgreSQL pokrenut
3. Provjeri port i credentials

### Google OAuth ne radi

1. Provjeri je li `GOOGLE_SCOPE_ID` isti na frontendu i backendu
2. Provjeri **Authorized origins** u Google Console
3. Provjeri je li VITE_ prefix prisutan za frontend

---

## Brza Referenca

| Okruženje | Backend Host | Backend Port | Frontend Port |
|-----------|--------------|--------------|---------------|
| Lokalno | `localhost` | `8000` | `5173` |
| Docker | `esustav_db` | `8000` (interno) | `5173` (interno) |
| Docker (vanjski) | - | `8700` (nginx) | `8700` (nginx) |
