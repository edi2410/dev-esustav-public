# Uloge i Dozvole - eSustav

Ovaj dokument opisuje sustav uloga i dozvola u eSustav aplikaciji.

## Sadržaj
- [Pregled Uloga](#pregled-uloga)
- [Grupe Uloga](#grupe-uloga)
- [Matrica Dozvola](#matrica-dozvola)
- [Posebni Slučajevi](#posebni-slučajevi)
- [Pristup po Modulima](#pristup-po-modulima)
- [Peer Review Pravila](#peer-review-pravila)
- [Preporuke Voditelja](#preporuke-voditelja)

---

## Pregled Uloga

### Dostupne Uloge

| Uloga | Enum Vrijednost | Grupa |
|-------|-----------------|-------|
| Član/ica | `CLAN` | Član |
| Voditelj/ica | `VODITELJ` | Voditelji |
| Koordinator/ica | `KOORDINATOR` | Voditelji |
| Tajnik/ca | `TAJNIK` | Predsjedništvo |
| Potpredsjednik/ca | `POTPREDSJEDNIK` | Predsjedništvo |
| Predsjednik/ca | `PREDSJEDNIK` | Predsjedništvo |

### Hijerarhija Uloga

```
                    Predsjednik/ca
                    Potpredsjednik/ca
                    Tajnik/ca
                         │
            ┌────────────┴────────────┐
            │                         │
      Koordinator/ica           Koordinator/ica
            │                         │
      ┌─────┴─────┐             ┌─────┴─────┐
      │           │             │           │
  Voditelj    Voditelj      Voditelj    Voditelj
      │           │             │           │
   Članovi     Članovi       Članovi     Članovi
```

---

## Grupe Uloga

Uloge su grupirane u tri kategorije koje određuju razinu pristupa:

| Grupa | Uloge | Opis |
|-------|-------|------|
| **Član** | Član/ica | Osnovni članovi timova |
| **Voditelji** | Voditelj/ica, Koordinator/ica | Vodstvo timova i koordinacija |
| **Predsjedništvo** | Tajnik/ca, Potpredsjednik/ca, Predsjednik/ca | Upravljačka razina |

---

## Matrica Dozvola

### Osnovna Matrica

| Dozvola | Član | Voditelj | Koordinator | Tajnik | Potpredsjednik | Predsjednik |
|---------|:----:|:--------:|:-----------:|:------:|:--------------:|:-----------:|
| `info` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `aktivnosti` | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `partneri` | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `izbori` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `suprach` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `suprach_admin` | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| `admin` | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| `can_vote` | * | * | * | * | * | * |

> **Napomena:** `can_vote` se dodjeljuje ručno kroz admin panel.

### Opis Dozvola

| Dozvola | Opis |
|---------|------|
| `info` | Pristup info modulu i certifikatima |
| `aktivnosti` | Upravljanje aktivnostima (kreiranje, uređivanje) |
| `partneri` | Upravljanje partnerima i kontaktima |
| `izbori` | Pristup izbornom modulu |
| `suprach` | Sudjelovanje u peer review-u |
| `suprach_admin` | Administrativne funkcije peer review-a |
| `admin` | Potpuni administrativni pristup |
| `can_vote` | Pravo glasanja na izborima |

---

## Posebni Slučajevi

### IT Tim - Admin Pristup

Članovi IT tima s ulogom **Voditelj** ili **Koordinator** automatski dobivaju **pune admin ovlasti**.

| Uloga | Tim | info | aktivnosti | partneri | izbori | suprach | suprach_admin | admin |
|-------|-----|:----:|:----------:|:--------:|:------:|:-------:|:-------------:|:-----:|
| Voditelj | IT | ✓ | ✓ | ✓ | ✓ | ✓ | **✓** | **✓** |
| Koordinator | IT | ✓ | ✓ | ✓ | ✓ | ✓ | **✓** | **✓** |
| Voditelj | Ostali | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| Koordinator | Ostali | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |

### Logika Dodjele (Backend)

```python
# estudenti/views.py

if role == "Član/ica":
    # Osnovni pristup
    permissions = {
        "info": True,
        "aktivnosti": False,
        "partneri": False,
        "izbori": True,
        "suprach": True,
        "admin": False
    }

elif team == "IT" and role in ["Voditelj/ica", "Koordinator/ica"]:
    # IT tim - puni pristup
    permissions = {
        "info": True,
        "aktivnosti": True,
        "partneri": True,
        "izbori": True,
        "suprach": True,
        "suprach_admin": True,
        "admin": True  # POSEBNO: Admin pristup
    }

else:
    # Svi ostali voditelji/koordinatori/predsjedništvo
    permissions = {
        "info": True,
        "aktivnosti": True,
        "partneri": True,
        "izbori": True,
        "suprach": True,
        "admin": False
    }
```

---

## Pristup po Modulima

### Info Modul (Certifikati)

Svaka grupa uloga ima drugačiji pogled na certifikate:

| Uloga | Što vidi | Tipovi Aktivnosti |
|-------|----------|-------------------|
| Član | Vlastite aktivnosti u timu | Sastanak, Standiranje |
| Voditelj | Prošireni pregled tima | Sastanak, VIP Sastanak, Standiranje, Pristupni |
| Koordinator | Aktivnosti na razini grupe | Sastanak, Pristupni Standiranje |

### Aktivnosti Modul

| Uloga | Može kreirati | Može uređivati | Može brisati |
|-------|:-------------:|:--------------:|:------------:|
| Član | ✗ | ✗ | ✗ |
| Voditelj | ✓ (svoj tim) | ✓ (svoj tim) | ✓ (svoj tim) |
| Koordinator | ✓ (grupa timova) | ✓ (grupa timova) | ✓ (grupa timova) |
| Admin | ✓ (sve) | ✓ (sve) | ✓ (sve) |

### Partneri Modul

| Uloga | Pristup |
|-------|---------|
| Član | Nema pristup |
| Voditelj+ | Puni pristup (CRUD) |

### Izbori Modul

| Uloga | Vidi glasove | Opseg |
|-------|:------------:|-------|
| Koordinator | ✓ | Cijela grupa timova |
| Ostali | ✓ | Samo vlastiti tim |

---

## Peer Review Pravila

### Tko koga može ocjenjivati

Pravila ocjenjivanja ovise o grupi uloga korisnika:

```
┌─────────────────────────────────────────────────────────────┐
│                    PREDSJEDNIŠTVO                           │
│  Može ocjenjivati:                                         │
│  - Sve članove svog tima                                   │
│  - Voditelje iz svoje grupe timova                         │
│  - Ostale članove predsjedništva                           │
│  Ne može: Članove iz drugih timova                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      VODITELJI                              │
│  Može ocjenjivati:                                         │
│  - Sve članove svog tima                                   │
│  - Članove predsjedništva iz svoje grupe                   │
│  Ne može: Članove iz drugih timova                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        ČLANOVI                              │
│  Može ocjenjivati:                                         │
│  - Članove svog tima (iste razine)                         │
│  Ne može: Voditelje, Predsjedništvo                        │
└─────────────────────────────────────────────────────────────┘
```

### Matrica Ocjenjivanja

| Ocjenjivač ↓ / Ocjenjivan → | Član | Voditelj | Koordinator | Predsjedništvo |
|:---------------------------:|:----:|:--------:|:-----------:|:--------------:|
| Član | ✓ (isti tim) | ✗ | ✗ | ✗ |
| Voditelj | ✓ (isti tim) | ✗ | ✗ | ✓ (ista grupa) |
| Koordinator | ✓ (isti tim) | ✓ (ista grupa) | ✗ | ✓ (ista grupa) |
| Predsjedništvo | ✓ (isti tim) | ✓ (ista grupa) | ✓ (ista grupa) | ✓ (ista grupa) |

---

## Preporuke Voditelja

Tko može davati preporuke za koga:

| Uloga | Može davati preporuke za |
|-------|--------------------------|
| Voditelj | Članove svog tima |
| Koordinator | Voditelje iz svoje grupe timova |
| Predsjednik/Potpredsjednik | Koordinatore, Potpredsjednike, Predsjednike (isti tim) |

---

## Sažetak po Ulogama

### Član/ica
- Osnovni pristup
- Može: vidjeti info, glasati, sudjelovati u peer review-u
- Ne može: upravljati aktivnostima, partnerima, admin funkcije

### Voditelj/ica
- Vodi tim
- Može: sve što član + upravljanje aktivnostima i partnerima
- Daje preporuke za članove svog tima

### Koordinator/ica
- Koordinira grupu timova
- Iste ovlasti kao voditelj
- Daje preporuke za voditelje
- IT Koordinator: ima admin pristup

### Tajnik/ca, Potpredsjednik/ca, Predsjednik/ca
- Upravljačka razina
- Pune ovlasti nad svim modulima (osim admin)
- Široki opseg u peer review-u

### IT Voditelj/Koordinator
- Posebna uloga
- Automatski dobiva `admin=True` i `suprach_admin=True`
- Puni pristup svim funkcionalnostima sustava

---

## Tehničke Reference

| Datoteka | Opis |
|----------|------|
| `backend/enums/RolesEnum.py` | Definicije uloga |
| `backend/enums/RolesGroupEnum.py` | Definicije grupa uloga |
| `backend/estudenti/models.py` | UserPermissions model |
| `backend/estudenti/views.py` | Logika dodjele dozvola |
