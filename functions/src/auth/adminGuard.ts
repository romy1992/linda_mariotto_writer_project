import { HttpsError, CallableRequest } from "firebase-functions/v2/https";

// Deve restare sincronizzato con l'UID admin hardcoded in firestore.rules e
// storage.rules (isAdmin()). I tre motori non possono condividere il file:
// se l'UID admin cambia, va aggiornato in tutti e tre i punti.
const ADMIN_UID = "2f6bylS8DrWniWMBOVtQMpplL0C2";

export function assertAdmin(request: CallableRequest): void {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Devi essere autenticato per usare questa funzione.");
  }
  if (request.auth.uid !== ADMIN_UID) {
    throw new HttpsError("permission-denied", "Non hai i permessi per usare questa funzione.");
  }
}
