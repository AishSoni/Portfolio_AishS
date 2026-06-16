/** Public portfolio routes only — exclude operator dashboard and resume serving. */
export function isTrackablePath(pathname: string | null): boolean {
  if (!pathname) return false;
  if (pathname.startsWith("/dashboard")) return false;
  if (pathname.startsWith("/r/")) return false;
  return true;
}
