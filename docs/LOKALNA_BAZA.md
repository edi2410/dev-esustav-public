# Lokalna Baza Podataka - Docker Setup

Upute za postavljanje PostgreSQL baze u Docker kontejneru i import SQL dump-a.

## Sadržaj
- [Brzi Start](#brzi-start)
- [Detaljne Upute](#detaljne-upute)
- [Import SQL Dump-a](#import-sql-dump-a)
- [Povezivanje s Backendom](#povezivanje-s-backendom)
- [Korisne Naredbe](#korisne-naredbe)
- [Troubleshooting](#troubleshooting)

---

## Brzi Start

```bash
# 1. Kreiraj i pokreni PostgreSQL kontejner
docker run -d \
  --name esustav_local_db \
  -e POSTGRES_DB=esustav \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=localdev123 \
  -p 5432:5432 \
  -v esustav_data:/var/lib/postgresql/data \
  postgres:15

# 2. Importaj SQL dump
docker exec -i esustav_local_db psql -U admin -d esustav < dump.sql

# 3. Konfiguriraj backend/.env
# DATABASE_HOST=localhost
# DATABASE_PORT=5432
```

---

## Detaljne Upute

### 1. Provjeri Docker

```bash
# Provjeri je li Docker pokrenut
docker --version
docker ps
```

### 2. Kreiraj PostgreSQL Kontejner

```bash
docker run -d \
  --name esustav_local_db \
  -e POSTGRES_DB=esustav \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=localdev123 \
  -p 5432:5432 \
  -v esustav_data:/var/lib/postgresql/data \
  postgres:15
```

#### Objašnjenje Parametara

| Parametar | Opis |
|-----------|------|
| `-d` | Pokreni u pozadini (detached) |
| `--name esustav_local_db` | Naziv kontejnera |
| `-e POSTGRES_DB=esustav` | Naziv baze podataka |
| `-e POSTGRES_USER=admin` | Korisnik baze |
| `-e POSTGRES_PASSWORD=localdev123` | Lozinka |
| `-p 5432:5432` | Port mapping (host:container) |
| `-v esustav_data:/var/lib/...` | Persistent volume za podatke |
| `postgres:15` | PostgreSQL verzija 15 |

### 3. Provjeri Status

```bash
# Provjeri je li kontejner pokrenut
docker ps

# Trebao bi vidjeti:
# CONTAINER ID   IMAGE         STATUS          PORTS                    NAMES
# abc123...      postgres:15   Up 10 seconds   0.0.0.0:5432->5432/tcp   esustav_local_db
```

---

## Import SQL Dump-a

### Metoda 1: Direktni Import

```bash
# Import iz SQL datoteke
docker exec -i esustav_local_db psql -U admin -d esustav < /putanja/do/dump.sql
```

### Metoda 2: Kopiranje u Kontejner

```bash
# 1. Kopiraj SQL datoteku u kontejner
docker cp dump.sql esustav_local_db:/tmp/dump.sql

# 2. Uđi u kontejner i importaj
docker exec -it esustav_local_db bash
psql -U admin -d esustav -f /tmp/dump.sql
exit
```

### Metoda 3: Korištenje pg_restore (za .dump format)

```bash
# Za custom format dump (.dump)
docker exec -i esustav_local_db pg_restore -U admin -d esustav < backup.dump

# Ili s dodatnim opcijama
docker exec -i esustav_local_db pg_restore \
  -U admin \
  -d esustav \
  --no-owner \
  --no-privileges \
  < backup.dump
```

### Metoda 4: Gzip Komprimirani Dump

```bash
# Import iz .sql.gz datoteke
gunzip -c dump.sql.gz | docker exec -i esustav_local_db psql -U admin -d esustav
```

---

## Povezivanje s Backendom

### Ažuriraj backend/.env

```env
DEBUG=True
SECRET_KEY=your-secret-key

GOOGLE_SCOPE_ID=your-google-client-id
GOOGLE_SECRET=your-google-secret

# Lokalni Docker PostgreSQL
DATABASE_NAME=esustav
DATABASE_USER=admin
DATABASE_PASSWORD=localdev123
DATABASE_HOST=localhost
DATABASE_PORT=5432
```

### Provjeri Konekciju

```bash
cd backend
source env/bin/activate

# Testiraj konekciju
python manage.py dbshell

# Ili provjeri migracije
python manage.py showmigrations
```

---

## Korisne Naredbe

### Upravljanje Kontejnerom

```bash
# Zaustavi kontejner
docker stop esustav_local_db

# Pokreni kontejner
docker start esustav_local_db

# Restart kontejner
docker restart esustav_local_db

# Obriši kontejner (podaci ostaju u volume-u)
docker rm esustav_local_db

# Obriši kontejner i volume (BRIŠE SVE PODATKE!)
docker rm esustav_local_db
docker volume rm esustav_data
```

### Pristup Bazi

```bash
# Uđi u psql shell
docker exec -it esustav_local_db psql -U admin -d esustav

# Unutar psql-a:
\dt                  -- lista tablica
\d+ ime_tablice      -- detalji tablice
\q                   -- izlaz
```

### Pregled Logova

```bash
# Pregled logova kontejnera
docker logs esustav_local_db

# Live praćenje logova
docker logs -f esustav_local_db
```

### Backup Baze

```bash
# Kreiraj SQL dump
docker exec esustav_local_db pg_dump -U admin esustav > backup_$(date +%Y%m%d).sql

# Kreiraj komprimirani dump
docker exec esustav_local_db pg_dump -U admin esustav | gzip > backup_$(date +%Y%m%d).sql.gz

# Custom format (brži restore)
docker exec esustav_local_db pg_dump -U admin -Fc esustav > backup_$(date +%Y%m%d).dump
```

### Reset Baze

```bash
# Obriši sve podatke i kreiraj novu bazu
docker exec -it esustav_local_db psql -U admin -c "DROP DATABASE esustav;"
docker exec -it esustav_local_db psql -U admin -c "CREATE DATABASE esustav;"

# Zatim importaj dump ponovno
docker exec -i esustav_local_db psql -U admin -d esustav < dump.sql
```

---

## Alternativa: Docker Compose

Ako preferiraš docker-compose, kreiraj `docker-compose.local.yml`:

```yaml
version: "3.8"

services:
  db:
    image: postgres:15
    container_name: esustav_local_db
    environment:
      POSTGRES_DB: esustav
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: localdev123
    ports:
      - "5432:5432"
    volumes:
      - esustav_data:/var/lib/postgresql/data
      # Opcionalno: automatski import pri prvom pokretanju
      # - ./init.sql:/docker-entrypoint-initdb.d/init.sql

volumes:
  esustav_data:
```

### Korištenje

```bash
# Pokreni
docker-compose -f docker-compose.local.yml up -d

# Zaustavi
docker-compose -f docker-compose.local.yml down

# Zaustavi i obriši volume
docker-compose -f docker-compose.local.yml down -v
```

---

## Troubleshooting

### Port 5432 je zauzet

```bash
# Provjeri što koristi port
lsof -i :5432

# Opcija 1: Zaustavi lokalni PostgreSQL
brew services stop postgresql  # macOS
sudo systemctl stop postgresql # Linux

# Opcija 2: Koristi drugi port
docker run -d \
  --name esustav_local_db \
  -p 5433:5432 \  # Promijeni na 5433
  ...

# Ažuriraj backend/.env
DATABASE_PORT=5433
```

### Kontejner se ne pokreće

```bash
# Provjeri logove
docker logs esustav_local_db

# Česti uzroci:
# - Port zauzet
# - Nedovoljno memorije
# - Volume permission problemi
```

### Import SQL-a ne radi

```bash
# Provjeri encoding
file dump.sql
# Treba biti: UTF-8 Unicode text

# Pretvori ako je potrebno
iconv -f ISO-8859-1 -t UTF-8 dump.sql > dump_utf8.sql

# Provjeri ima li grešaka u SQL-u
head -100 dump.sql
```

### "FATAL: password authentication failed"

```bash
# Provjeri credentials
docker exec -it esustav_local_db psql -U admin -d esustav

# Ako ne radi, možda trebaš resetirati
docker rm -f esustav_local_db
docker volume rm esustav_data
# Zatim ponovo kreiraj kontejner
```

### "database does not exist"

```bash
# Kreiraj bazu ručno
docker exec -it esustav_local_db psql -U admin -c "CREATE DATABASE esustav;"
```

---

## Brza Referenca

| Akcija | Naredba |
|--------|---------|
| Pokreni kontejner | `docker start esustav_local_db` |
| Zaustavi kontejner | `docker stop esustav_local_db` |
| Uđi u psql | `docker exec -it esustav_local_db psql -U admin -d esustav` |
| Import SQL | `docker exec -i esustav_local_db psql -U admin -d esustav < dump.sql` |
| Export SQL | `docker exec esustav_local_db pg_dump -U admin esustav > backup.sql` |
| Pregled logova | `docker logs -f esustav_local_db` |
| Reset baze | Drop + Create + Import |

---

## Konfiguracija za Različite Portove

| Okruženje | Host | Port | DATABASE_HOST | DATABASE_PORT |
|-----------|------|------|---------------|---------------|
| Docker DB (default) | localhost | 5432 | `localhost` | `5432` |
| Docker DB (alt port) | localhost | 5433 | `localhost` | `5433` |
| Full Docker Compose | - | - | `esustav_db` | `5432` |
