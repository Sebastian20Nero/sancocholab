/* Donde se guarda Token */
const ACCESS_TOKEN_KEY = 'access_token';

export const AuthStorage = {
  getToken(): string | null {
    const t = localStorage.getItem(ACCESS_TOKEN_KEY);
    // Evita el caso "undefined" guardado como string
    if (!t || t === 'undefined' || t === 'null') return null;
    return t;
  },

  setToken(token: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  clear() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },
};
