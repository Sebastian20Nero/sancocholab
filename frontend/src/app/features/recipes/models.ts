// src/app/features/recipes/models.ts
export interface RecipeCategory {
  idCategoriaReceta: string; // BigInt como string
  nombre: string;
  color: string;
  activo: boolean;
}

export interface Recipe {
  idReceta: string;
  nombre: string;
  porcionesBase?: string | null;
  activo: boolean;
  categoriaId?: string | null;
  categoria?: RecipeCategory | null;
}

export interface RecipeItem {
  idRecetaItem: string;
  recetaId: string;
  productoId: string;
  unidadId: string;
  cantidad: string;
  modo: 'AUTO' | 'BY_PROVIDER' | 'HYPOTHETICAL' | 'BY_PROVIDER';
  proveedorId?: string | null;
  producto?: { idProducto: string; nombre: string };
  unidad?: { idUnidadMedida: string; key: string; nombre: string };
  proveedor?: { idProveedor: string; nombre: string };
}

export type Paginated<T> = {
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  items: T[];
};
