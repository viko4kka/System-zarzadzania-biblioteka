# System zarządzania biblioteką

> Biblioteka Informatyka

Aplikacja webowa do zarządzania katalogiem książek i wypożyczeniami.

## Technologie

- Frontend: React + Vite + TypeScript + TailwindCSS
- Backend: NestJS + Prisma + Swagger + PostgreSQL + JWT
- Baza danych: PostgreSQL
- Konteneryzacja: Docker + Docker Compose

## Wymagania

Do uruchomienia projektu potrzebne są: Docker Desktop, Node.js 22 i npm. Przed uruchomieniem komend Docker Desktop musi być włączony.

## Konfiguracja środowiska

W repozytorium znajduje się plik `.env.example` z przykładowymi zmiennymi. Przed pierwszym uruchomieniem trzeba utworzyć lokalny plik `.env`.

Git Bash / Linux:
```bash
cp .env.example .env
```
Windows CMD:
```bash
copy .env.example .env
```
Plik `.env` nie powinien być dodawany do repozytorium. Do repozytorium trafia tylko `.env.example`.

## Uruchomienie developerskie

Środowisko developerskie uruchamia frontend, backend i bazę PostgreSQL z pliku `docker-compose.development.yml`.

```bash
npm run dev:up
```
Adresy po uruchomieniu:
```text
Frontend:    http://localhost:3000
Backend:     http://localhost:4000
Swagger:     http://localhost:4000/api/docs
Healthcheck: http://localhost:4000/api/health
```
Zatrzymanie kontenerów:
```bash
npm run dev:down
```
Podgląd logów:
```bash
npm run dev:logs
```

## Uruchomienie produkcyjne

Środowisko produkcyjne uruchamia aplikację z pliku `docker-compose.production.yml`.

```bash
npm run prod:up
```
W tej wersji frontend jest budowany przez Vite, a gotowe pliki są uruchamiane w kontenerze nginx. Backend jest uruchamiany z plików zbudowanych przez NestJS i łączy się z bazą PostgreSQL przez sieć Docker Compose. Sekrety i porty są pobierane z lokalnego pliku `.env`.

Adresy po uruchomieniu są takie same jak w wersji developerskiej.

Zatrzymanie kontenerów:
```bash
npm run prod:down
```
Podgląd logów:
```bash
npm run prod:logs
```

## Baza danych

Model bazy danych znajduje się w pliku `backend/prisma/schema.prisma`.

Migracje developerskie:
```bash
npm run migrate:dev
```
Migracje produkcyjne:
```bash
npm run migrate:prod
```
Seed bazy danych w trybie developerskim:
```bash
npm run seed
```

## Sprawdzenie działania

Po uruchomieniu produkcji można sprawdzić kontenery:
```bash
docker ps
```
Dla produkcji powinny działać kontenery frontendu, backendu i bazy danych.

Healthcheck backendu:
```bash
curl http://localhost:4000/api/health
```
Poprawna odpowiedź:
```json
{"status":"ok"}
```
Swagger powinien być dostępny pod adresem `http://localhost:4000/api/docs`.

## Dodatkowe skrypty

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Pliki Docker Compose

- `docker-compose.development.yml` - środowisko developerskie
- `docker-compose.production.yml` - środowisko produkcyjne

Plik produkcyjny nie zawiera sekretów wpisanych na sztywno. Wartości są pobierane z `.env`.

## Zasady branchowania

- `main` - główna gałąź projektu, zmiany tylko przez Pull Request
- `feat/nazwa` - nowa funkcjonalność
- `fix/nazwa` - naprawa błędu
- `chore/nazwa` - konfiguracja, skrypty, DevOps
- `docs/nazwa` - dokumentacja

## Konwencja commitów

Używamy Conventional Commits: `feat:` - nowa funkcjonalność, `fix:` - naprawa błędu, `docs:` - dokumentacja, `chore:` - konfiguracja / porządki, `refactor:` - refaktoryzacja kodu.

## Zespół

- Frontend: 4 osoby
- Backend: 5 osób
- DevOps: 2 osoby
