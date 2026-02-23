/**
 * Tipo mínimo del usuario autenticado que queda en req.user
 * (lo construye JwtStrategy.validate()).
 *
 * Mantenerlo simple ayuda a tipar Guards y Controllers.
 */
export type AuthUser = {
  userId: string;     // viene como string porque el JWT payload usa sub como string
  username: string;
  roles: string[];    // ej: ['ADMIN', 'OPERADOR']
};
