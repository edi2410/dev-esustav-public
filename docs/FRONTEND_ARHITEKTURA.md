# Frontend Arhitektura - eSustav

Ovaj dokument opisuje arhitekturu frontend dijela eSustav aplikacije.

## Sadržaj
- [Tehnološki Stack](#tehnološki-stack)
- [Struktura Projekta](#struktura-projekta)
- [Moduli Aplikacije](#moduli-aplikacije)
- [State Management](#state-management)
- [Routing](#routing)
- [API Integracija](#api-integracija)
- [Autentikacija](#autentikacija)
- [Stilizacija](#stilizacija)
- [Konvencije i Obrasci](#konvencije-i-obrasci)

---

## Tehnološki Stack

### Core

| Tehnologija | Verzija | Namjena |
|-------------|---------|---------|
| React | 18.2.0 | UI framework |
| TypeScript | 4.9.5 | Tipizacija |
| Vite | 4.4.7 | Build tool i dev server |
| React Router | 6.11.2 | Routing |

### UI i Stilizacija

| Tehnologija | Namjena |
|-------------|---------|
| Ant Design 5.12 | UI komponente |
| Custom CSS | Modularni stilovi |
| React Icons | Ikone |
| React Responsive | Responzivni dizajn |

### State Management i API

| Tehnologija | Namjena |
|-------------|---------|
| React Context | Globalni state (user, axios) |
| React Query 3.39 | Server state i caching |
| Axios 1.4 | HTTP klijent |

### Autentikacija

| Tehnologija | Namjena |
|-------------|---------|
| @react-oauth/google | Google OAuth 2.0 |
| js-cookie | Upravljanje kolačićima |
| sessionStorage | Pohrana tokena |

### Ostalo

| Tehnologija | Namjena |
|-------------|---------|
| dayjs / moment | Rad s datumima |
| react-qr-scanner | QR skeniranje |
| rc-tree | Tree komponenta |

---

## Struktura Projekta

```
frontend/src/
│
├── assets/                  # Statički resursi
│   ├── images/             # SVG i PNG slike
│   └── font/               # Poppins font
│
├── components/             # Komponente po modulima
│   ├── eAdmin/            # Admin komponente
│   ├── eaktivnosti/       # Aktivnosti komponente
│   ├── eInfo/             # Info komponente
│   ├── eIzbori/           # Izbori komponente
│   ├── ePartneri/         # Partneri komponente
│   ├── suprach/           # Peer review komponente
│   ├── NavBar.tsx         # Navigacija
│   ├── RoutesList.tsx     # Route renderer
│   ├── HomeOption.tsx     # Tile komponenta
│   └── NoPermission.tsx   # Error komponenta
│
├── configurations/         # Konfiguracije
│   ├── routes.tsx         # Definicije ruta
│   ├── navbarItems.tsx    # Navbar stavke
│   └── [modul]/           # Konfiguracije po modulu
│
├── context/               # React Context provideri
│   ├── UserContext.ts     # User state
│   └── AxiosContext.ts    # HTTP klijent
│
├── hooks/                 # Custom React hookovi
│   ├── useUserContext.ts
│   ├── useAxios.ts
│   ├── user-hooks/        # Auth hookovi
│   ├── eaktivnosti-hooks/ # Aktivnosti hookovi
│   ├── einfo-hooks/       # Info hookovi
│   ├── eIzbori-hooks/     # Izbori hookovi
│   ├── epartneri-hooks/   # Partneri hookovi
│   ├── eadmin-hooks/      # Admin hookovi
│   └── suprach-hooks/     # Peer review hookovi
│
├── layouts/               # Layout komponente
│   └── MainLayout.tsx     # Glavni layout
│
├── pages/                 # Stranice po modulima
│   ├── HomePage.tsx       # Početna stranica
│   ├── LoginPage.tsx      # Login stranica
│   ├── eAdmin/
│   ├── eAktivnosti/
│   ├── eInfo/
│   ├── eIzbori/
│   ├── ePartneri/
│   └── suprach/
│
├── types/                 # TypeScript tipovi
│   ├── UserTypes.ts
│   ├── TeamTypes.ts
│   ├── ActivityTypes.ts
│   ├── PartnerTypes.ts
│   ├── VotesTypes.ts
│   ├── Enums.ts
│   └── index.ts
│
├── styles/                # CSS datoteke
│   ├── homePage.css
│   ├── loginPage.css
│   ├── navbarHeader.css
│   └── [modul].css
│
├── App.tsx                # Root komponenta
├── main.tsx               # Entry point
└── index.css              # Globalni stilovi
```

---

## Moduli Aplikacije

### Pregled Modula

| Modul | Opis | Komponente |
|-------|------|------------|
| **eAktivnosti** | Upravljanje aktivnostima | ActivityList, ActivityForm, QrCodeModal |
| **eInfo** | Profil i certifikati | InfoList, InfoAdmin, CertificateRequirements |
| **eIzbori** | Izbori i glasanje | Candidate, VotesForm, Documents |
| **ePartneri** | Upravljanje partnerima | PartnerForm, PartnerDetails, ContactsForm |
| **suprach** | Peer review/ocjenjivanje | Grading, GradesOverview, CommentsOverview |
| **eAdmin** | Administracija | UploadUsers, DownloadCertificateData |

### Dijagram Modula

```
┌─────────────────────────────────────────────────────────────┐
│                        HomePage                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │Aktivnosti│ │   Info   │ │  Izbori  │ │ Partneri │       │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘       │
└───────┼────────────┼────────────┼────────────┼──────────────┘
        │            │            │            │
        ▼            ▼            ▼            ▼
   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐
   │eAktiv-  │  │ eInfo/  │  │eIzbori/ │  │ePartneri│
   │nosti/   │  │         │  │         │  │         │
   │ pages   │  │ pages   │  │ pages   │  │ pages   │
   └─────────┘  └─────────┘  └─────────┘  └─────────┘
```

### Ključne Komponente po Modulu

#### eAktivnosti (Aktivnosti)
```
components/eaktivnosti/
├── ActivityList.tsx          # Lista aktivnosti
├── ActivityForm.tsx          # Forma za kreiranje
├── AddActivityButton.tsx     # Gumb za dodavanje
├── EditActivity.tsx          # Uređivanje aktivnosti
├── DeleteActivity.tsx        # Brisanje aktivnosti
├── UserOnActivityModal.tsx   # Modal za sudionike
├── ActivityCards.tsx         # Kartice aktivnosti
├── Recommendations.tsx       # Preporuke voditelja
├── RecommendationsForm.tsx   # Forma preporuka
└── QrCodeModal.tsx           # QR kod modal
```

#### eInfo (Informacije)
```
components/eInfo/
├── InfoList.tsx                    # Lista korisnika
├── InfoAdmin.tsx                   # Admin pregled
├── InfoListVoditelj.tsx            # Pregled za voditelje
├── InfoListKoordinator.tsx         # Pregled za koordinatore
├── InfoListClan.tsx                # Pregled za članove
├── InfoListCertificateRequirements.tsx  # Zahtjevi za certifikat
├── ScanQrCodeModal.tsx             # QR skener
└── InfoAdminUpdateSpecificRow.tsx  # Admin uređivanje
```

#### eIzbori (Izbori)
```
components/eIzbori/
├── Candidate.tsx             # Prikaz kandidata
├── ElectionsVoditelji.tsx    # Izbori za voditelje
├── ElectionsUP.tsx           # Izbori za UP
├── ElectionsDocuments.tsx    # Dokumenti izbora
├── VotesForm.tsx             # Forma za glasanje
├── VotesFormPredsjednistvo.tsx  # Glasanje predsjedništvo
├── VotesFormKoordinator.tsx  # Glasanje koordinatori
└── Documents.tsx             # Pregled dokumenata
```

#### ePartneri (Partneri)
```
components/ePartneri/
├── PartnerForm.tsx           # Forma partnera
├── AddNewPartnerModal.tsx    # Modal za dodavanje
├── PartnerDetails.tsx        # Detalji partnera
├── ContactsForm.tsx          # Forma kontakata
├── NotesForm.tsx             # Forma bilješki
├── EditPartnerButton.tsx     # Gumb za uređivanje
└── EditContactModal.tsx      # Modal za kontakte
```

#### suprach (Peer Review)
```
components/suprach/
├── Grading.tsx                   # Ocjenjivanje
├── OverviewHome.tsx              # Početni pregled
├── GradesOverview.tsx            # Pregled ocjena
├── CommentsOverview.tsx          # Pregled komentara
├── UsersWhoNotFillSuprach.tsx    # Neispunjeni suprach
└── CommentsAndGradesForSpecial.tsx  # Posebni pregled
```

---

## State Management

### React Context

Aplikacija koristi dva glavna context-a:

#### UserContext

Pohranjuje podatke o prijavljenom korisniku.

```typescript
interface UserData {
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    photo: string;
  };
  role: {
    id: number;
    name: string;        // npr. "Član/ica", "Voditelj/ica"
    role_group: string;  // npr. "Član", "Voditelji"
  };
  team: {
    id: number;
    name: string;
    short_name: string;
  };
  team_group: {
    id: number;
    name: string;
  };
  permissions: {
    info: boolean;
    aktivnosti: boolean;
    partneri: boolean;
    izbori: boolean;
    suprach: boolean;
    admin: boolean;
    can_vote: boolean;
  };
  academic_year: {
    id: number;
    short: string;
    description: string;
  };
}
```

#### AxiosContext

Pruža konfiguriranu Axios instancu s interceptorima.

```typescript
// Request interceptor - dodaje Authorization header
axios.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - rukuje 401 greškama
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem("accessToken");
      window.location.reload();
    }
    return Promise.reject(error);
  }
);
```

### React Query

Koristi se za server state management i caching API poziva.

```typescript
// Primjer hooka s React Query
export const useGetUserData = () => {
  const axios = useAxios();

  return useQuery(
    "user_data",
    async () => {
      const response = await axios.get("estudenti/users/data/");
      return response.data;
    },
    {
      staleTime: Infinity,  // Podaci ostaju svježi dok se ručno ne refetchaju
      enabled: !!sessionStorage.getItem("accessToken"),
    }
  );
};
```

---

## Routing

### Konfiguracija Ruta

Rute su definirane u `configurations/routes.tsx`:

```typescript
export const routes = [
  { path: "/", element: <HomePage /> },
  { path: "/activity", element: <HomePageAktivnosti /> },
  { path: "/info", element: <HomePageInfo /> },
  { path: "/partners", element: <HomePagePartneri /> },
  { path: "/partners/:partnerId", element: <PartnerDetailsPage /> },
  { path: "/elections", element: <HomePageIzbori /> },
  { path: "/admin/elections/results", element: <ElectionsResultsPage /> },
  { path: "/admin", element: <HomePageEAdmin /> },
  { path: "/suprach", element: <SuprachHomePage /> },
  { path: "/suprach/comments", element: <CommentUserPage /> },
  { path: "/suprach/users/notfill", element: <UsersWhoNotFillPage /> },
  { path: "/suprach/grading/:userToGradeId/:isSpecialUser/:name", element: <GreadingUserPage /> },
];
```

### Zaštita Ruta

Rute se štite provjerom korisničkih dozvola:

```typescript
// Na HomePage - prikaz opcija ovisno o dozvolama
{user.permissions.aktivnosti && (
  <HomeOption
    title="Aktivnosti"
    onClick={() => navigate("/activity")}
  />
)}

{user.permissions.info && (
  <HomeOption
    title="Info"
    onClick={() => navigate("/info")}
  />
)}
```

---

## API Integracija

### Base URL Konfiguracija

```typescript
// AxiosContext.ts
const axiosInstance = axios.create({
  // Lokalni development
  baseURL: "http://127.0.0.1:8000/api/",

  // Docker
  // baseURL: "http://127.0.0.1:8700/api/",

  // Produkcija
  // baseURL: "https://esustav.estudent.hr/api/",
});
```

### Primjeri API Poziva

```typescript
// Dohvat aktivnosti
const { data: activities } = useQuery("activities", () =>
  axios.get("eaktivnosti/activities/")
);

// Kreiranje aktivnosti
const mutation = useMutation((newActivity) =>
  axios.post("eaktivnosti/activities/", newActivity)
);

// Ažuriranje partnera
const updateMutation = useMutation((data) =>
  axios.patch(`epartneri/partners/${data.id}/`, data)
);
```

### Struktura Hookova

```typescript
// hooks/eaktivnosti-hooks/useGetActivities.ts
export const useGetActivities = () => {
  const axios = useAxios();

  return useQuery(
    "activities",
    async () => {
      const response = await axios.get("eaktivnosti/activities/");
      return response.data;
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minuta
    }
  );
};
```

---

## Autentikacija

### Flow Autentikacije

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Login     │     │   Google    │     │   Backend   │
│   Page      │────▶│   OAuth     │────▶│   /auth/    │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                                               ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   HomePage  │◀────│  UserData   │◀────│   Access    │
│             │     │   Context   │     │   Token     │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Koraci Autentikacije

1. **Login stranica** prikazuje Google Login gumb
2. **Google OAuth** vraća credential (JWT)
3. **useLoginUser** šalje credential backendu
4. **Backend** validira i vraća access token
5. **Token** se sprema u sessionStorage
6. **useGetUserData** dohvaća korisničke podatke
7. **UserContext** se popunjava podacima
8. **UI** se renderira prema dozvolama

### Implementacija

```typescript
// LoginPage.tsx
<GoogleLogin
  onSuccess={(credentialResponse) => {
    setCredential(credentialResponse.credential);
  }}
  onError={() => {
    console.log("Login Failed");
  }}
/>

// useLoginUser hook
useEffect(() => {
  if (credential) {
    loginMutation.mutate(credential);
  }
}, [credential]);

const loginMutation = useMutation(
  (credential) => axios.post(`auth/?credential=${credential}`),
  {
    onSuccess: (response) => {
      sessionStorage.setItem("accessToken", response.data.access);
      window.location.reload();
    },
  }
);
```

### Odjava

```typescript
const handleLogout = () => {
  sessionStorage.removeItem("accessToken");
  window.location.reload();
};
```

---

## Stilizacija

### Pristup

- **Ant Design** - Primarna UI komponenta biblioteka
- **Custom CSS** - Modularne CSS datoteke
- **Inline Styles** - Za dinamičke stilove

### Boje

| Boja | Hex | Korištenje |
|------|-----|------------|
| Primarna | `#c5272f` | Gumbi, headeri, brand |
| Bijela | `#ffffff` | Tekst na tamnoj pozadini |
| Tamna | `#1f1f1f` | Pozadine |

### Ant Design Tema

```typescript
<ConfigProvider
  locale={hr_HR}
  theme={{
    token: {
      colorPrimary: "#c5272f",
    },
  }}
>
  {children}
</ConfigProvider>
```

### Responzivni Breakpointi

| Breakpoint | Širina |
|------------|--------|
| xs | < 476px |
| sm | ≥ 476px |
| md | ≥ 768px |
| lg | ≥ 992px |
| xl | ≥ 1200px |
| xxl | ≥ 1400px |

### Primjer CSS-a

```css
/* homePage.css */
.homePageContainer {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
}

@media (max-width: 768px) {
  .homePageContainer {
    flex-direction: column;
    padding: 10px;
  }
}
```

---

## Konvencije i Obrasci

### Imenovanje

| Tip | Konvencija | Primjer |
|-----|------------|---------|
| Komponente | PascalCase | `ActivityList.tsx` |
| Hookovi | camelCase + use | `useGetActivities.ts` |
| Tipovi | PascalCase | `ActivityType` |
| CSS klase | camelCase | `.containerLogin` |
| Konstante | SCREAMING_SNAKE | `API_BASE_URL` |

### Struktura Komponente

```typescript
// Imports
import React, { useState, useEffect } from "react";
import { Button, Table } from "antd";
import { useGetActivities } from "@hooks/eaktivnosti-hooks";
import type { Activity } from "@types";

// Props interface
interface ActivityListProps {
  teamId: number;
  showActions?: boolean;
}

// Component
export const ActivityList: React.FC<ActivityListProps> = ({
  teamId,
  showActions = true,
}) => {
  // Hooks
  const { data, isLoading } = useGetActivities(teamId);
  const [selected, setSelected] = useState<Activity | null>(null);

  // Handlers
  const handleSelect = (activity: Activity) => {
    setSelected(activity);
  };

  // Render
  if (isLoading) return <Spin />;

  return (
    <Table
      dataSource={data}
      onRow={(record) => ({
        onClick: () => handleSelect(record),
      })}
    />
  );
};
```

### Path Aliasi

```typescript
// tsconfig.json paths
{
  "@components/*": ["src/components/*"],
  "@hooks/*": ["src/hooks/*"],
  "@types/*": ["src/types/*"],
  "@configurations/*": ["src/configurations/*"],
  "@context/*": ["src/context/*"],
  "@pages/*": ["src/pages/*"],
  "@styles/*": ["src/styles/*"],
  "@assets/*": ["src/assets/*"]
}

// Korištenje
import { ActivityList } from "@components/eaktivnosti";
import { useGetActivities } from "@hooks/eaktivnosti-hooks";
import type { Activity } from "@types";
```

### Lazy Loading

```typescript
// App.tsx
const NavBar = React.lazy(() => import("@components/NavBar"));
const HomePage = React.lazy(() => import("@pages/HomePage"));

// Korištenje sa Suspense
<Suspense fallback={<Spin size="large" />}>
  <NavBar />
  <Routes>
    <Route path="/" element={<HomePage />} />
  </Routes>
</Suspense>
```

### Error Handling

```typescript
// React Query error handling
const { data, error, isError } = useQuery("activities", fetchActivities, {
  onError: (error) => {
    console.error("Failed to fetch activities:", error);
    message.error("Greška pri dohvaćanju aktivnosti");
  },
});

// Conditional rendering
if (isError) {
  return <Alert type="error" message="Došlo je do greške" />;
}
```

---

## Development

### Pokretanje

```bash
cd frontend
npm install
npm start
```

### Build

```bash
npm run build
```

### Environment Varijable

```env
# frontend/.env
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

### Pristup Varijablama

```typescript
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
```

---

## Zaključak

Frontend eSustav aplikacije je organiziran po feature-based principu s jasnom separacijom:

1. **Komponente** - UI elementi grupirani po modulu
2. **Hookovi** - Logika dohvaćanja podataka
3. **Stranice** - Kompozicija komponenata
4. **Tipovi** - TypeScript definicije
5. **Konfiguracije** - Rute i postavke

Korištenje React Query-a za server state i Context API-a za globalni state pruža jednostavan ali moćan pristup upravljanju stanjem aplikacije.
