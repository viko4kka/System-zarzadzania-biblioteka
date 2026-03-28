# Backend

API obsługujące bibliotekę informatyczną.

## Technologie

NodeJS + NestJS + Prisma + Swagger + PostgreSQL

## Instalacja

Przed przystąpieniem do instalacji należy skonfigurować środowisko oraz uruchomić bazę danych. Przykład pliku .env przedstawia plik .env.example.

```bash
npm install
# Wygenerowanie modeli TypeScript
npx prisma generate
# Wyczyszczenie bazy danych
npx prisma migrate reset 
```

## Uruchamianie

```bash
# development
npm run start

# production
npm run start:prod
```

API dostępne domyślnie na porcie 3001.

Health:

[http://127.0.0.1:3001/api/health](http://127.0.0.1:3001/api/health)

Swagger UI:

[http://127.0.0.1:3001/api/docs](http://127.0.0.1:3001/api/docs)

## Baza Danych

Model bazy danych definiuje plik /prisma/schema.prisma

Aby zaszła modyfikacja bazy danych należy wygenerować modele TypeScript oraz dokonać migracji.
```bash
# Generowanie modeli TypeScript
npx prisma generate
# Utworzenie nowej migracji
npx prisma migrate dev
```
