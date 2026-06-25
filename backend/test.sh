#!/bin/bash

BASE_URL="http://127.0.0.1:4000"
COOKIE_JAR="./cookies.txt"
PASS=0
FAIL=0
TIMESTAMP=$(date +%s)

# Dane testowe
TEST_BOOK_TITLE="test_title_$TIMESTAMP"
TEST_BOOK_ISBN="978$(echo $TIMESTAMP | tail -c 11)"
TEST_AUTHOR_NAME="test_name"
TEST_AUTHOR_LASTNAME="test_lastname_$TIMESTAMP"
TEST_PUBLISHER="test_publisher_$TIMESTAMP"
TEST_USER_MAIL="test_user_$TIMESTAMP@test.com"
TEST_USER_PASSWORD="Test1234!"
TEST_USER_NAME="test_name_$TIMESTAMP"
TEST_USER_LASTNAME="test_lastname_$TIMESTAMP"

EXISTING_BOOK_ID=1

rm -f $COOKIE_JAR

check() {
  local TEST_NAME=$1
  local EXPECTED=$2
  local ACTUAL=$3
  if echo "$ACTUAL" | grep -q "$EXPECTED"; then
    echo "✓ $TEST_NAME"
    PASS=$((PASS + 1))
  else
    echo "✗ $TEST_NAME"
    echo "  expected: $EXPECTED"
    echo "  actual:   $ACTUAL"
    FAIL=$((FAIL + 1))
  fi
}

extract() {
  local KEY=$1
  local JSON=$2
  echo $JSON | grep -o "\"$KEY\":[^,}]*" | head -1 | grep -o '[0-9]*' | head -1
}

extract_str() {
  local KEY=$1
  local JSON=$2
  echo $JSON | grep -o "\"$KEY\":\"[^\"]*\"" | head -1 | sed 's/.*":"//' | sed 's/"//'
}

# ══════════════════════════════════════════════════════════════
# HEALTH
# ══════════════════════════════════════════════════════════════
echo ""
echo "=== HEALTH ==="

RESPONSE=$(curl -s -X GET "$BASE_URL/api/health")
check "Status serwera" "ok" "$RESPONSE"

# ══════════════════════════════════════════════════════════════
# AUTH
# ══════════════════════════════════════════════════════════════
echo ""
echo "=== AUTH ==="

RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/logout")
check "Wylogowanie nie będąc zalogowanym" "niezalogowany" "$RESPONSE"

RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"mail":"zly@email.com","password":"zlehaslo"}')
check "Logowanie złe dane" "Nieprawidłowy email lub hasło" "$RESPONSE"

REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"mail\":\"$TEST_USER_MAIL\",
    \"password\":\"$TEST_USER_PASSWORD\",
    \"name\":\"$TEST_USER_NAME\",
    \"lastname\":\"$TEST_USER_LASTNAME\"
  }")
check "Rejestracja nowego użytkownika" "id" "$REGISTER_RESPONSE"
TEST_USER_ID=$(extract "id" "$REGISTER_RESPONSE")

RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"mail\":\"$TEST_USER_MAIL\",
    \"password\":\"$TEST_USER_PASSWORD\",
    \"name\":\"$TEST_USER_NAME\",
    \"lastname\":\"$TEST_USER_LASTNAME\"
  }")
check "Rejestracja duplikat" "już istnieje" "$RESPONSE"

LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -c $COOKIE_JAR \
  -d '{"mail":"admin@prisma.io","password":"haslo1234"}')
check "Logowanie admin" "is_Admin" "$LOGIN_RESPONSE"

RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/logout" \
  -b $COOKIE_JAR \
  -c $COOKIE_JAR)
check "Wylogowanie" "success" "$RESPONSE"

# ══════════════════════════════════════════════════════════════
# USER — zwykły użytkownik
# ══════════════════════════════════════════════════════════════
echo ""
echo "=== USER (zwykły użytkownik) ==="

LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -c $COOKIE_JAR \
  -d "{\"mail\":\"$TEST_USER_MAIL\",\"password\":\"$TEST_USER_PASSWORD\"}")
check "Logowanie zwykły użytkownik" "id" "$LOGIN_RESPONSE"

USER_RESPONSE=$(curl -s -X GET "$BASE_URL/api/user" -b $COOKIE_JAR)
ORIGINAL_NAME=$(extract_str "name" "$USER_RESPONSE")
ORIGINAL_LASTNAME=$(extract_str "lastname" "$USER_RESPONSE")
check "Pobieranie własnych danych" "id" "$USER_RESPONSE"

RESPONSE=$(curl -s -X GET "$BASE_URL/api/user?page=1" \
  -b $COOKIE_JAR)
check "Lista użytkowników (brak dostępu)" "administrator" "$RESPONSE"

RESPONSE=$(curl -s -X GET "$BASE_URL/api/user/1" \
  -b $COOKIE_JAR)
check "Pobieranie danych innego użytkownika (brak dostępu)" "dostępu" "$RESPONSE"

RESPONSE=$(curl -s -X PATCH "$BASE_URL/api/user/updateUser" \
  -H "Content-Type: application/json" \
  -b $COOKIE_JAR \
  -d "{
    \"name\":\"test_newname_$TIMESTAMP\",
    \"lastname\":\"test_newlastname_$TIMESTAMP\",
    \"oldpassword\":\"$TEST_USER_PASSWORD\",
    \"newpassword\":\"\"
  }")
check "Aktualizacja danych użytkownika" "id" "$RESPONSE"

RESPONSE=$(curl -s -X PATCH "$BASE_URL/api/user/updateUser" \
  -H "Content-Type: application/json" \
  -b $COOKIE_JAR \
  -d '{
    "name":"test_name",
    "lastname":"test_lastname",
    "oldpassword":"zlehaslo",
    "newpassword":""
  }')
check "Aktualizacja danych (złe hasło)" "Niepoprawne hasło" "$RESPONSE"

# Przywróć oryginalne dane użytkownika
curl -s -X PATCH "$BASE_URL/api/user/updateUser" \
  -H "Content-Type: application/json" \
  -b $COOKIE_JAR \
  -d "{
    \"name\":\"$ORIGINAL_NAME\",
    \"lastname\":\"$ORIGINAL_LASTNAME\",
    \"oldpassword\":\"$TEST_USER_PASSWORD\",
    \"newpassword\":\"\"
  }" >/dev/null

RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/logout" \
  -b $COOKIE_JAR \
  -c $COOKIE_JAR)
check "Wylogowanie zwykły użytkownik" "success" "$RESPONSE"

# ══════════════════════════════════════════════════════════════
# USER — admin
# ══════════════════════════════════════════════════════════════
echo ""
echo "=== USER (admin) ==="

LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -c $COOKIE_JAR \
  -d '{"mail":"admin@prisma.io","password":"haslo1234"}')
check "Logowanie admin" "id" "$LOGIN_RESPONSE"

RESPONSE=$(curl -s -X GET "$BASE_URL/api/user?page=1&limit=10" \
  -b $COOKIE_JAR)
check "Lista użytkowników" "meta" "$RESPONSE"

RESPONSE=$(curl -s -X GET "$BASE_URL/api/user?page=1&limit=10&search=test" \
  -b $COOKIE_JAR)
check "Lista użytkowników z wyszukiwaniem" "meta" "$RESPONSE"

RESPONSE=$(curl -s -X GET "$BASE_URL/api/user?page=999&limit=10" \
  -b $COOKIE_JAR)
check "Lista użytkowników (strona poza zakresem)" "totalPages" "$RESPONSE"

RESPONSE=$(curl -s -X GET "$BASE_URL/api/user/$TEST_USER_ID" \
  -b $COOKIE_JAR)
check "Pobieranie danych użytkownika po id" "id" "$RESPONSE"

RESPONSE=$(curl -s -X GET "$BASE_URL/api/user/999999" \
  -b $COOKIE_JAR)
check "Pobieranie danych użytkownika (nie istnieje)" "Nie ma użytkownika o takim id" "$RESPONSE"

RESPONSE=$(curl -s -X PATCH "$BASE_URL/api/user/$TEST_USER_ID/ban" \
  -b $COOKIE_JAR)
check "Zbanowanie użytkownika" "is_Banned" "$RESPONSE"

RESPONSE=$(curl -s -X PATCH "$BASE_URL/api/user/$TEST_USER_ID/unban" \
  -b $COOKIE_JAR)
check "Odbanowanie użytkownika" "is_Banned" "$RESPONSE"

RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/logout" \
  -b $COOKIE_JAR \
  -c $COOKIE_JAR)
check "Wylogowanie admin" "success" "$RESPONSE"

# ══════════════════════════════════════════════════════════════
# BOOK — publiczne
# ══════════════════════════════════════════════════════════════
echo ""
echo "=== BOOK (publiczne) ==="

RESPONSE=$(curl -s -X GET "$BASE_URL/api/book")
check "Lista książek" "meta" "$RESPONSE"

RESPONSE=$(curl -s -X GET "$BASE_URL/api/book?page=1&limit=10")
check "Lista książek z paginacją" "totalPages" "$RESPONSE"

RESPONSE=$(curl -s -X GET "$BASE_URL/api/book?search=test")
check "Wyszukiwanie książek" "meta" "$RESPONSE"

RESPONSE=$(curl -s -X GET "$BASE_URL/api/book?page=999&limit=10")
check "Lista książek (strona poza zakresem)" "totalPages" "$RESPONSE"

RESPONSE=$(curl -s -X GET "$BASE_URL/api/book/$EXISTING_BOOK_ID")
check "Pobieranie danych książki" "id_book" "$RESPONSE"

RESPONSE=$(curl -s -X GET "$BASE_URL/api/book/999999")
check "Pobieranie danych książki (nie istnieje)" "nie istnieje" "$RESPONSE"

RESPONSE=$(curl -s -X POST "$BASE_URL/api/book/add" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\":\"$TEST_BOOK_TITLE\",
    \"year\":2000,
    \"publisher_name\":\"$TEST_PUBLISHER\",
    \"ISBN\":\"$TEST_BOOK_ISBN\",
    \"authors\":[{\"author_name\":\"$TEST_AUTHOR_NAME\",\"author_lastname\":\"$TEST_AUTHOR_LASTNAME\"}]
  }")
check "Dodanie książki (brak autoryzacji)" "niezalogowany" "$RESPONSE"

# ══════════════════════════════════════════════════════════════
# BOOK — admin
# ══════════════════════════════════════════════════════════════
echo ""
echo "=== BOOK (admin) ==="

LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -c $COOKIE_JAR \
  -d '{"mail":"admin@prisma.io","password":"haslo1234"}')
check "Logowanie admin" "id" "$LOGIN_RESPONSE"

ADD_BOOK_RESPONSE=$(curl -s -X POST "$BASE_URL/api/book/add" \
  -H "Content-Type: application/json" \
  -b $COOKIE_JAR \
  -d "{
    \"title\":\"$TEST_BOOK_TITLE\",
    \"year\":2000,
    \"cover\":\"https://example.com/test_cover.jpg\",
    \"publisher_name\":\"$TEST_PUBLISHER\",
    \"ISBN\":\"$TEST_BOOK_ISBN\",
    \"authors\":[{\"author_name\":\"$TEST_AUTHOR_NAME\",\"author_lastname\":\"$TEST_AUTHOR_LASTNAME\"}]
  }")
check "Dodanie książki" "id_book" "$ADD_BOOK_RESPONSE"
TEST_BOOK_ID=$(extract "id_book" "$ADD_BOOK_RESPONSE")

BOOK_RESPONSE=$(curl -s -X GET "$BASE_URL/api/book/$TEST_BOOK_ID")
ORIGINAL_TITLE=$(extract_str "title" "$BOOK_RESPONSE")
ORIGINAL_YEAR=$(extract "year" "$BOOK_RESPONSE")
check "Pobieranie danych nowej książki" "id_book" "$BOOK_RESPONSE"

RESPONSE=$(curl -s -X POST "$BASE_URL/api/book/add" \
  -H "Content-Type: application/json" \
  -b $COOKIE_JAR \
  -d "{
    \"title\":\"$TEST_BOOK_TITLE\",
    \"year\":2000,
    \"publisher_name\":\"$TEST_PUBLISHER\",
    \"ISBN\":\"$TEST_BOOK_ISBN\",
    \"authors\":[{\"author_name\":\"$TEST_AUTHOR_NAME\",\"author_lastname\":\"$TEST_AUTHOR_LASTNAME\"}]
  }")
check "Dodanie książki (duplikat)" "już istnieje" "$RESPONSE"

RESPONSE=$(curl -s -X POST "$BASE_URL/api/book/add" \
  -H "Content-Type: application/json" \
  -b $COOKIE_JAR \
  -d "{
    \"title\":\"test_title_other_$TIMESTAMP\",
    \"year\":2000,
    \"publisher_name\":\"$TEST_PUBLISHER\",
    \"ISBN\":\"123\",
    \"authors\":[{\"author_name\":\"$TEST_AUTHOR_NAME\",\"author_lastname\":\"$TEST_AUTHOR_LASTNAME\"}]
  }")
check "Dodanie książki (nieprawidłowy ISBN)" "ISBN musi mieć" "$RESPONSE"

RESPONSE=$(curl -s -X PATCH "$BASE_URL/api/book/update/$TEST_BOOK_ID" \
  -H "Content-Type: application/json" \
  -b $COOKIE_JAR \
  -d "{\"title\":\"test_title_updated_$TIMESTAMP\"}")
check "Aktualizacja tytułu książki" "id_book" "$RESPONSE"

RESPONSE=$(curl -s -X PATCH "$BASE_URL/api/book/update/$TEST_BOOK_ID" \
  -H "Content-Type: application/json" \
  -b $COOKIE_JAR \
  -d "{\"authors\":[
    {\"author_name\":\"$TEST_AUTHOR_NAME\",\"author_lastname\":\"$TEST_AUTHOR_LASTNAME\"},
    {\"author_name\":\"test_name2\",\"author_lastname\":\"test_lastname2_$TIMESTAMP\"}
  ]}")
check "Aktualizacja autorów książki" "id_book" "$RESPONSE"

RESPONSE=$(curl -s -X PATCH "$BASE_URL/api/book/update/$TEST_BOOK_ID" \
  -H "Content-Type: application/json" \
  -b $COOKIE_JAR \
  -d "{\"publisher_name\":\"test_publisher_new_$TIMESTAMP\"}")
check "Aktualizacja wydawnictwa książki" "id_book" "$RESPONSE"

RESPONSE=$(curl -s -X PATCH "$BASE_URL/api/book/update/$TEST_BOOK_ID" \
  -H "Content-Type: application/json" \
  -b $COOKIE_JAR \
  -d '{"ISBN":"123"}')
check "Aktualizacja książki (nieprawidłowy ISBN)" "ISBN musi mieć" "$RESPONSE"

RESPONSE=$(curl -s -X PATCH "$BASE_URL/api/book/update/999999" \
  -H "Content-Type: application/json" \
  -b $COOKIE_JAR \
  -d '{"title":"test_title_updated"}')
check "Aktualizacja książki (nie istnieje)" "nie istnieje" "$RESPONSE"

# Przywróć oryginalny tytuł i rok
curl -s -X PATCH "$BASE_URL/api/book/update/$TEST_BOOK_ID" \
  -H "Content-Type: application/json" \
  -b $COOKIE_JAR \
  -d "{\"title\":\"$ORIGINAL_TITLE\",\"year\":$ORIGINAL_YEAR}" >/dev/null

RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/logout" \
  -b $COOKIE_JAR \
  -c $COOKIE_JAR)
check "Wylogowanie admin" "success" "$RESPONSE"

# ══════════════════════════════════════════════════════════════
# COPY — admin
# ══════════════════════════════════════════════════════════════
echo ""
echo "=== COPY (admin) ==="

LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -c $COOKIE_JAR \
  -d '{"mail":"admin@prisma.io","password":"haslo1234"}')
check "Logowanie admin" "id" "$LOGIN_RESPONSE"

RESPONSE=$(curl -s -X GET "$BASE_URL/api/copy/$EXISTING_BOOK_ID?page=1&limit=10" \
  -b $COOKIE_JAR)
check "Lista kopii książki" "meta" "$RESPONSE"

ADD_COPY_RESPONSE=$(curl -s -X POST "$BASE_URL/api/copy/add/$EXISTING_BOOK_ID" \
  -b $COOKIE_JAR)
check "Dodanie kopii" "id_copy" "$ADD_COPY_RESPONSE"
TEST_COPY_ID=$(extract "id_copy" "$ADD_COPY_RESPONSE")

ADD_COPY2_RESPONSE=$(curl -s -X POST "$BASE_URL/api/copy/add/$EXISTING_BOOK_ID" \
  -b $COOKIE_JAR)
check "Dodanie drugiej kopii" "id_copy" "$ADD_COPY2_RESPONSE"
TEST_COPY2_ID=$(extract "id_copy" "$ADD_COPY2_RESPONSE")

RESPONSE=$(curl -s -X PATCH "$BASE_URL/api/copy/remove/$TEST_COPY2_ID" \
  -b $COOKIE_JAR)
check "Usunięcie kopii" "is_actual" "$RESPONSE"

RESPONSE=$(curl -s -X PATCH "$BASE_URL/api/copy/remove/$TEST_COPY2_ID" \
  -b $COOKIE_JAR)
check "Usunięcie kopii (już usuniętej)" "już usunięta" "$RESPONSE"

RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/logout" \
  -b $COOKIE_JAR \
  -c $COOKIE_JAR)
check "Wylogowanie admin" "success" "$RESPONSE"

# ══════════════════════════════════════════════════════════════
# LOAN — zwykły użytkownik
# ══════════════════════════════════════════════════════════════
echo ""
echo "=== LOAN (zwykły użytkownik) ==="

LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -c $COOKIE_JAR \
  -d "{\"mail\":\"$TEST_USER_MAIL\",\"password\":\"$TEST_USER_PASSWORD\"}")
check "Logowanie zwykły użytkownik" "id" "$LOGIN_RESPONSE"

LOAN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/loan/loanBook/$TEST_COPY_ID" \
  -b $COOKIE_JAR)
check "Wypożyczenie książki" "copy_id" "$LOAN_RESPONSE"

RESPONSE=$(curl -s -X POST "$BASE_URL/api/loan/loanBook/$TEST_COPY_ID" \
  -b $COOKIE_JAR)
check "Wypożyczenie już wypożyczonej kopii" "już wypożyczona" "$RESPONSE"

RESPONSE=$(curl -s -X POST "$BASE_URL/api/loan/loanBook/$TEST_COPY2_ID" \
  -b $COOKIE_JAR)
check "Wypożyczenie usuniętej kopii" "nie istnieje" "$RESPONSE"

RESPONSE=$(curl -s -X GET "$BASE_URL/api/loan/ActiveLoans?page=1&limit=10" \
  -b $COOKIE_JAR)
check "Lista aktywnych wypożyczeń" "meta" "$RESPONSE"

RESPONSE=$(curl -s -X GET "$BASE_URL/api/loan/loans" \
  -b $COOKIE_JAR)
check "Historia wypożyczeń" "id_loan" "$RESPONSE"

RESPONSE=$(curl -s -X PATCH "$BASE_URL/api/loan/returnBook/$TEST_COPY_ID" \
  -b $COOKIE_JAR)
check "Zwrot książki" "return_date" "$RESPONSE"

RESPONSE=$(curl -s -X PATCH "$BASE_URL/api/loan/returnBook/$TEST_COPY_ID" \
  -b $COOKIE_JAR)
check "Zwrot już zwróconej książki" "aktywnego wypożyczenia" "$RESPONSE"

RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/logout" \
  -b $COOKIE_JAR \
  -c $COOKIE_JAR)
check "Wylogowanie zwykły użytkownik" "success" "$RESPONSE"

# ══════════════════════════════════════════════════════════════
# LOAN — admin
# ══════════════════════════════════════════════════════════════
echo ""
echo "=== LOAN (admin) ==="

LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -c $COOKIE_JAR \
  -d '{"mail":"admin@prisma.io","password":"haslo1234"}')
check "Logowanie admin" "id" "$LOGIN_RESPONSE"

RESPONSE=$(curl -s -X GET "$BASE_URL/api/loan/loans/$TEST_USER_ID" \
  -b $COOKIE_JAR)
check "Historia wypożyczeń użytkownika (admin)" "id_loan" "$RESPONSE"

# ══════════════════════════════════════════════════════════════
# CLEANUP
# ══════════════════════════════════════════════════════════════
echo ""
echo "=== CLEANUP ==="

RESPONSE=$(curl -s -X DELETE "$BASE_URL/api/book/delete/$TEST_BOOK_ID" \
  -b $COOKIE_JAR)
check "Hard delete książki testowej" "id_book" "$RESPONSE"

# Hard delete użytkownika testowego
RESPONSE=$(curl -s -X DELETE "$BASE_URL/api/auth/deleteUser/$TEST_USER_ID" \
  -b $COOKIE_JAR)
check "Hard delete użytkownika testowego" "id" "$RESPONSE"

RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/logout" \
  -b $COOKIE_JAR \
  -c $COOKIE_JAR)
check "Wylogowanie admin" "success" "$RESPONSE"

# ══════════════════════════════════════════════════════════════
# SUMMARY
# ══════════════════════════════════════════════════════════════
echo ""
echo "========================="
echo "  PASS:  $PASS"
echo "  FAIL:  $FAIL"
echo "  TOTAL: $((PASS + FAIL))"
echo "========================="

rm -f $COOKIE_JAR
