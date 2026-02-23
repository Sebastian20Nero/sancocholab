export interface Product {
  id: number | string;

  nombre: string;
  descripcion?: string | null;

  categoriaId?: number | string | null;

  // si tu backend lo manda así:
  categoriaNombre?: string | null;

  activo: boolean;

  createdAt?: string;
  updatedAt?: string;
}
