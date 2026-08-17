export function getSaveErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "code" in error && error.code === "permission-denied") {
    return "Permesso negato: non risulti autenticato come amministratore. Prova a rifare il login.";
  }
  return "Salvataggio non riuscito. Riprova.";
}
