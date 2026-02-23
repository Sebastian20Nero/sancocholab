export interface ProductQuery {
  q?: string;
  activo?: boolean | null;
  page?: number;
  limit?: number;

  // si luego filtras por categoría desde backend, lo agregamos:
  categoriaId?: number | string | null;
}
