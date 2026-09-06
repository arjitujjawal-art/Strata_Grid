// Environment and application configuration

// Helper to get Mapbox token from environment or localStorage override
export function getMapboxToken(): string {
  // Check localStorage first so the user can easily paste a token in the UI if needed
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('stratagrid_mapbox_token');
    if (stored && stored.trim().length > 10) {
      return stored.trim();
    }
  }

  // Check Vite environment variables
  const envToken =
    (import.meta as any).env?.VITE_MAPBOX_TOKEN ||
    process.env.VITE_MAPBOX_TOKEN ||
    process.env.MAPBOX_TOKEN ||
    '';

  return envToken.trim();
}

export function setMapboxToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('stratagrid_mapbox_token', token.trim());
    window.dispatchEvent(new Event('stratagrid_token_updated'));
  }
}

export const MAPBOX_DARK_STYLE = 'mapbox://styles/mapbox/dark-v11';
