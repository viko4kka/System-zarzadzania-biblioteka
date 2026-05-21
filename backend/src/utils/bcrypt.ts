import * as bcrypt from 'bcrypt';

// Ustawienie soli
const SALT_ROUNDS = 12;

// Funkcja do hashowania hasła
export async function makeHash(password: string) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

// Funkcja do weryfikacji hasła
export async function verifyHash(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}
