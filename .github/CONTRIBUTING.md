# Konwencja pracy z repozytorium

## Conventional Commits

Format commita:
```
typ(zakres): opis
```

### Typy
- `feat` — nowa funkcjonalność
- `fix` — naprawa błędu
- `docs` — zmiany w dokumentacji
- `chore` — konfiguracja, porządki, zależności
- `refactor` — refaktoryzacja bez zmiany funkcjonalności
- `test` — dodanie lub poprawienie testów
- `style` — formatowanie, brak zmian logiki

### Przykłady
```
feat(auth): dodano endpoint POST /auth/login
fix(books): naprawiono paginację listy książek
docs(readme): zaktualizowano instrukcję uruchomienia
chore(docker): dodano docker-compose.yml
```

## Gałęzie

- `main` — produkcja, tylko przez PR
- `develop` — gałąź robocza zespołu
- `feat/nazwa` — nowa funkcjonalność
- `fix/nazwa` — naprawa błędu
- `docs/nazwa` — dokumentacja
- `chore/nazwa` — konfiguracja

## Pull Requesty

- Każdy PR musi mieć wypełniony szablon
- Minimum 1 osoba musi zatwierdzić PR przed mergem
- Branch musi być aktualny z `develop` przed mergem