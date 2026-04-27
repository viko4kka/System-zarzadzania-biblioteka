# System zarządzania biblioteką

> Biblioteka Informatyka

Aplikacja webowa do zarządzania katalogiem książek i wypożyczeniami.

## Technologie

React + Vite + TypeScript + TailwindCSS  
NestJS + Prisma + Swagger + PostgreSQL + JWT  
Docker + Docker Compose

## Instalacja

Przed uruchomieniem należy włączyć Docker Desktop.

```bash
npm run dev:up
npm run dev:down
npm run dev:logs
```

Komenda `npm run dev:up` uruchamia frontend, backend oraz bazę danych PostgreSQL przy użyciu pliku `docker-compose.development.yml`.

`npm run dev:down` zatrzymuje i usuwa kontenery uruchomione w trybie developerskim., a `npm run dev:logs` wyświetla logi uruchomionych usług.

## Uruchamianie

Frontend:

```text
http://localhost:3000
```

Backend:

```text
http://localhost:4000
```

Swagger:

```text
http://localhost:4000/api/docs
```

Healthcheck:

```text
http://localhost:4000/api/health
```

## Baza danych

Model bazy danych definiuje plik:

```text
backend/prisma/schema.prisma
```

Migracja developerska:

```bash
docker compose -f docker-compose.development.yml exec backend npx prisma migrate dev
```

lub z poziomu root scripts:

```bash
npm run migrate:dev
```

## Dodatkowe skrypty

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

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
- **Backend:** 5 osób
- **DevOps:** 2 osoby
