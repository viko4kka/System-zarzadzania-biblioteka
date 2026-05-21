const bcrypt = require('bcrypt');

// Ustawienie soli
const SALT_ROUNDS = 12;

// Funkcja do hashowania hasła
export async function hash(string) {
    return bcrypt
        .genSalt(SALT_ROUNDS)
        .then(salt => {
            return bcrypt.hash(string, salt)
        });
}

// Funkcja do weryfikacji hasła
export async function verifyHash(string, hash) {
    return await bcrypt.compare(string, hash);
}
