export function getMermUserId(): string {
  const userId = process.env.MERM_USER_ID;
  if (!userId) {
    throw new Error("Missing MERM_USER_ID env var");
  }
  return userId;
}
