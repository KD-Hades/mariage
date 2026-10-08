const ATTENDANCE_OPTIONS = new Set(["Présent(e)", "Absent(e)"]);

export function normalizeRsvp(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("Les données du formulaire sont invalides.");
  }

  const name = typeof input.name === "string" ? input.name.trim() : "";
  const attendance = input.attendance;
  const diet = typeof input.diet === "string" ? input.diet.trim() : "";
  const message = typeof input.message === "string" ? input.message.trim() : "";

  if (!name || name.length > 120) {
    throw new Error("Veuillez saisir un nom (120 caractères maximum).");
  }
  if (!ATTENDANCE_OPTIONS.has(attendance)) {
    throw new Error("Veuillez choisir une réponse de présence valide.");
  }
  if (diet.length > 1000 || message.length > 2000) {
    throw new Error("Un champ dépasse la longueur autorisée.");
  }

  let guests = 0;
  if (attendance === "Présent(e)") {
    guests = Number(input.guests);
    if (![1, 2].includes(guests)) {
      throw new Error("Le nombre de personnes doit être 1 ou 2.");
    }
  }

  return {
    name,
    attendance,
    guests,
    diet: attendance === "Présent(e)" ? diet : "",
    message
  };
}