# System zarządzania biblioteką
> Biblioteka Informatyka

Aplikacja webowa do zarządzania katalogiem książek i wypożyczeniami.

## Stack techniczny
- **Frontend:** Next.js + TypeScript + Tailwind
- **Backend:** Node.js + Express + TypeScript + Prisma
- **Baza danych:** PostgreSQL
- **Konteneryzacja:** Docker Compose

## Wymagania
- Node.js 20+
- Docker Desktop
- npm

## Uruchomienie lokalne (Docker)
```bash
cp .env.example .env
docker compose up --build
```

Aplikacja dostępna pod:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/api
- Swagger: http://localhost:4000/api/docs

## Uruchomienie bez Dockera
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

## Zmienne środowiskowe
Skopiuj `.env.example` i uzupełnij wartości:

| Zmienna | Opis | Przykład |
|---------|------|---------|
| DATABASE_URL | URL do bazy PostgreSQL | postgresql://user:pass@localhost:5432/db |
| JWT_SECRET | Sekret do podpisywania tokenów | supersecretkey |
| PORT | Port backendu | 3001 |

## Zasady branchowania
- `main` — produkcja, tylko przez PR
- `develop` — gałąź robocza
- `feat/nazwa` — nowa funkcjonalność
- `fix/nazwa` — naprawa błędu

## Konwencja commitów
Używamy Conventional Commits:
- `feat:` — nowa funkcjonalność
- `fix:` — naprawa błędu
- `docs:` — dokumentacja
- `chore:` — konfiguracja

## Zespół
- **Frontend:** 4 osoby
- **Backend:** 5 osoby
- **DevOps:** 3 osoby