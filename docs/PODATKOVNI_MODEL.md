# Podatkovni Model - eSustav

Ovaj dokument opisuje arhitekturu podataka na backendu eSustav aplikacije.

## Sadržaj
- [Pregled](#pregled)
- [Osnovni Modeli](#osnovni-modeli)
- [Uloge i Grupe Uloga](#uloge-i-grupe-uloga)
- [Akademska Godina - Aktivne Godine](#akademska-godina---aktivne-godine)
- [Organizacijska Struktura](#organizacijska-struktura)
- [Sustav Dozvola](#sustav-dozvola)
- [Dijagram Relacija](#dijagram-relacija)
- [Primjeri Upita](#primjeri-upita)

---

## Pregled

eSustav je aplikacija za upravljanje studentskom organizacijom. Ključna karakteristika sustava je da su **svi podaci vezani uz akademsku godinu**. To znači da isti korisnik može imati različite uloge u različitim akademskim godinama.

### Ključni Koncepti

1. **Multi-tenancy po akademskoj godini** - Sustav koristi `active=True` na modelu `AcademicYear` kao selektor trenutne akademske godine
2. **Uloge nisu trajne** - Korisnicima se dodjeljuju uloge preko `UsersPositions` tablice, vezane uz specifičnu akademsku godinu
3. **Hijerarhija uloga** - Postoji jasna hijerarhija od člana do predsjednika

---

## Osnovni Modeli

### User (Korisnik)

Proširuje Django-ov `AbstractUser` model.

| Polje | Tip | Opis |
|-------|-----|------|
| email | CharField | Jedinstveni identifikator (koristi se za prijavu) |
| username | CharField | Korisničko ime |
| first_name | CharField | Ime |
| last_name | CharField | Prezime |
| gender | CharField | Spol (male/female/other) |
| photo | ImageField | Profilna fotografija |
| deleted | BooleanField | Soft delete zastavica |

**Lokacija:** `backend/estudenti/models.py`

### AcademicYear (Akademska Godina)

Definira akademske godine u sustavu.

| Polje | Tip | Opis |
|-------|-----|------|
| start_date | DateField | Početak akademske godine |
| end_date | DateField | Kraj akademske godine |
| description | CharField | Puni naziv (npr. "2023/2024") |
| short | CharField | Kratki naziv (npr. "23/24") |
| active | BooleanField | **KRITIČNO** - označava trenutno aktivnu godinu |
| deleted | BooleanField | Soft delete zastavica |

> **Važno:** U sustavu smije biti samo JEDNA aktivna akademska godina (`active=True`).

---

## Uloge i Grupe Uloga

### RoleGroups (Grupe Uloga)

Kategorizira uloge u logičke grupe.

| Vrijednost | Opis |
|------------|------|
| Član | Redovni članovi |
| Voditelji | Voditelji timova |
| Predsjedništvo | Predsjedništvo organizacije |

### Roles (Uloge)

Specifične uloge unutar organizacije.

| Uloga | Grupa | Opis |
|-------|-------|------|
| Član/ica | Član | Redovni član tima |
| Voditelj/ica | Voditelji | Voditelj tima |
| Koordinator/ica | Voditelji | Koordinator grupe timova |
| Tajnik/ca | Predsjedništvo | Tajnik organizacije |
| Potpredsjednik/ca | Predsjedništvo | Potpredsjednik organizacije |
| Predsjednik/ca | Predsjedništvo | Predsjednik organizacije |

### Hijerarhija Uloga

```
Predsjednik/ca
Potpredsjednik/ca
Tajnik/ca
└── Koordinator/ica
    └── Voditelj/ica
        └── Član/ica
```

---

## Akademska Godina - Aktivne Godine

### Što znači "aktivna godina"?

**Aktivna godina** je akademska godina s oznakom `active=True`. Sustav očekuje da u bilo kojem trenutku postoji samo jedna aktivna godina.

### Kako se koristi u upitima?

Gotovo svaki upit u sustavu filtrira podatke po aktivnoj godini:

```python
# Dohvat aktivne akademske godine
AcademicYear.objects.get(active=True)

# Filtriranje korisničkih pozicija po aktivnoj godini
UsersPositions.objects.filter(academic_year__active=True)

# Dohvat pozicije trenutnog korisnika za aktivnu godinu
user_position = UsersPositions.objects.get(
    user=request.user,
    academic_year__active=True
)
```

### UsersPositions - Ključna Tablica

Ova tablica povezuje korisnike s njihovim ulogama **za određenu akademsku godinu**.

| Polje | Tip | Opis |
|-------|-----|------|
| user | ForeignKey → User | Korisnik |
| role | ForeignKey → Roles | Uloga korisnika |
| team | ForeignKey → Teams | Tim kojem pripada |
| team_group | ForeignKey → TeamGroups | Grupa timova |
| virtual_team | ForeignKey → VirtualTeams | Virtualni tim (opcionalno) |
| academic_year | ForeignKey → AcademicYear | Akademska godina |

**Ključna spoznaja:** Isti korisnik može imati:
- Ulogu "Član" u godini 2022/2023
- Ulogu "Voditelj" u godini 2023/2024
- Ulogu "Koordinator" u godini 2024/2025

---

## Organizacijska Struktura

### TeamGroups (Grupe Timova)

| Polje | Tip | Opis |
|-------|-----|------|
| name | CharField | Naziv grupe (npr. "IT", "Marketing") |
| short_name | CharField | Kratki naziv |
| active | BooleanField | Je li grupa aktivna |
| virtual | BooleanField | Je li virtualna grupa |
| deleted | BooleanField | Soft delete |

### Teams (Timovi)

| Polje | Tip | Opis |
|-------|-----|------|
| name | CharField | Naziv tima |
| short_name | CharField | Kratki naziv |
| description | TextField | Opis tima |
| team_group | ForeignKey → TeamGroups | Pripadajuća grupa |
| active | BooleanField | Je li tim aktivan |
| deleted | BooleanField | Soft delete |

### VirtualTeams (Virtualni Timovi)

Podzimovi unutar timova (opcionalno).

### Hijerarhija Organizacije

```
TeamGroups (npr. "IT Sektor")
    │
    ├── Teams (npr. "IT Tim")
    │   │
    │   └── VirtualTeams (npr. "Backend razvoj")
    │       │
    │       └── Users (s ulogama po akademskoj godini)
    │
    └── Teams (npr. "DevOps Tim")
        └── ...
```

---

## Sustav Dozvola

### UserPermissions

Granularni pristup modulima po akademskoj godini.

| Polje | Tip | Opis |
|-------|-----|------|
| user | ForeignKey → User | Korisnik |
| academic_year | ForeignKey → AcademicYear | Akademska godina |
| info | BooleanField | Pristup info modulu |
| aktivnosti | BooleanField | Pristup aktivnostima |
| partneri | BooleanField | Pristup partnerima |
| izbori | BooleanField | Pristup izborima |
| suprach | BooleanField | Pristup peer review-u |
| suprach_admin | BooleanField | Admin peer review-a |
| admin | BooleanField | Potpuni admin pristup |
| can_vote | BooleanField | Pravo glasa na izborima |

### Logika Dodjele Dozvola

| Uloga | info | aktivnosti | partneri | izbori | suprach | admin |
|-------|------|------------|----------|--------|---------|-------|
| Član | ✓ | ✗ | ✗ | ✓ | ✓ | ✗ |
| Voditelj | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| Koordinator | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| IT Voditelj/Koordinator | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Predsjedništvo | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

---

## Dijagram Relacija

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  User (1) ─────────────────────┐                               │
│    │                           │                               │
│    │ 1:M                       │                               │
│    ▼                           │                               │
│  UsersPositions (M)            │                               │
│    │     │      │              │                               │
│    │     │      └──► TeamGroups                                │
│    │     └──► Teams                                            │
│    │     └──► VirtualTeams                                     │
│    │     └──► Roles ──► RoleGroups                             │
│    │                           │                               │
│    └───────► UserPermissions (1)                               │
│               │                                                │
│               └────────────────► AcademicYear (1)              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  AKTIVNOSTI                                                     │
│                                                                 │
│  ActivityTypeRequirements                                       │
│    ├── activity_type                                           │
│    ├── role_group (RoleGroups)                                 │
│    └── academic_year                                           │
│                                                                 │
│  Activity                                                       │
│    ├── user (odgovorna osoba)                                  │
│    ├── team                                                    │
│    ├── virtual_team                                            │
│    ├── activity_type                                           │
│    └── academic_year                                           │
│                                                                 │
│  UserActivity                                                   │
│    ├── user (sudionik)                                         │
│    ├── activity                                                │
│    └── academic_year                                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Primjeri Upita

### 1. Dohvat svih članova tima za aktivnu godinu

```python
from estudenti.models import UsersPositions
from enums.RolesEnum import RolesEnum

clanovi = UsersPositions.objects.filter(
    team__name="IT Tim",
    role__name=RolesEnum.CLAN.value,
    academic_year__active=True
)
```

### 2. Provjera uloge korisnika

```python
user_position = UsersPositions.objects.get(
    user=request.user,
    academic_year__active=True
)

if user_position.role.name == RolesEnum.PREDSJEDNIK.value:
    # Logika za predsjednika
    pass
elif user_position.role.name == RolesEnum.VODITELJ.value:
    # Logika za voditelja
    pass
```

### 3. Dohvat zahtjeva za certifikat prema grupi uloga

```python
from einfo.models import ActivityTypeRequirements

academic_year = AcademicYear.objects.get(active=True)
user_position = UsersPositions.objects.get(
    user=request.user,
    academic_year=academic_year
)

zahtjevi = ActivityTypeRequirements.objects.filter(
    academic_year=academic_year,
    role_group=user_position.role.role_group
)
```

### 4. Kreiranje korisnika s pozicijom

```python
from estudenti.models import User, UsersPositions, AcademicYear
from estudenti.models import Roles, Teams, TeamGroups

# Kreiranje korisnika
user = User.objects.create(
    email="novi@student.hr",
    first_name="Ime",
    last_name="Prezime"
)

# Dodjela pozicije za aktivnu godinu
UsersPositions.objects.create(
    user=user,
    role=Roles.objects.get(name="Član/ica"),
    team=Teams.objects.get(name="IT Tim"),
    team_group=TeamGroups.objects.get(name="IT"),
    academic_year=AcademicYear.objects.get(active=True)
)
```

---

## Ostali Moduli

### Izbori (eizbori)
- `Elections` - Izbori po akademskoj godini
- `Candidate` - Kandidati na izborima
- `Votes`, `IsVoted` - Glasovi i evidencija glasanja

### Peer Review (suprach)
- `Suprach` - Runde peer reviewa
- `Gradings`, `Scores` - Ocjene kolega
- `QuestionRoleGroups` - Definira tko koga ocjenjuje

### Partneri (epartneri)
- `Partners` - Vanjski partneri
- `PartnersContact` - Kontakt podaci
- `PartnerNotes` - Bilješke o suradnji

### Certifikati (einfo)
- `CertificateRequirements` - Praćenje ispunjenosti zahtjeva za certifikat

---

## Zaključak

Razumijevanje podatkovnog modela eSustava zahtijeva razumijevanje dvije ključne stvari:

1. **Sve je vezano uz akademsku godinu** - Pozicije, dozvole, aktivnosti, zahtjevi - sve se filtrira po `academic_year__active=True`

2. **Uloge su dinamične** - Korisnik nema stalnu ulogu; njegova uloga ovisi o akademskoj godini kroz tablicu `UsersPositions`

Ova arhitektura omogućuje:
- Praćenje povijesti članstva
- Različite uloge u različitim godinama
- Čistu separaciju podataka između akademskih godina
- Fleksibilno upravljanje organizacijom
