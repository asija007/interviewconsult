export const normalizeSkills = (skills: string[]) =>
  skills
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
