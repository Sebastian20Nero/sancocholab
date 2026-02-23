// src/app/features/recipes/recipes.api.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Recipe, RecipeCategory, RecipeItem, Paginated } from './models';

@Injectable({ providedIn: 'root' })
export class RecipesApi {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000';

  getCategories(q?: string) {
    const params: any = { activo: 'true' };
    if (q) params.q = q;
    return this.http.get<RecipeCategory[]>(`${this.baseUrl}/recipe-categories`, { params });
  }

  // recipes.api.ts
  getProducts(params?: { page?: number; limit?: number; q?: string }) {
    const p: any = {};
    if (params?.page) p.page = params.page;
    if (params?.limit) p.limit = params.limit;
    if (params?.q) p.q = params.q;
    return this.http.get<any>(`${this.baseUrl}/products`, { params: p });
  }

  getMeasures() {
    return this.http.get<any[]>(`${this.baseUrl}/measures`);
  }


  listRecipes(params?: { page?: number; limit?: number; q?: string; activo?: boolean; categoriaId?: string }) {
    const p: any = {};
    if (params?.page) p.page = params.page;
    if (params?.limit) p.limit = params.limit;
    if (params?.q) p.q = params.q;
    if (params?.activo !== undefined) p.activo = String(params.activo);
    if (params?.categoriaId) p.categoriaId = params.categoriaId;
    return this.http.get<Paginated<Recipe>>(`${this.baseUrl}/recipes`, { params: p });
  }

  createRecipe(body: { nombre: string; porcionesBase?: string; categoriaId?: string }) {
    return this.http.post<Recipe>(`${this.baseUrl}/recipes`, body);
  }

  getRecipe(id: string) {
    return this.http.get<any>(`${this.baseUrl}/recipes/${id}`);
  }

  updateRecipe(id: string, body: { nombre?: string; porcionesBase?: string; categoriaId?: string }) {
    return this.http.patch<Recipe>(`${this.baseUrl}/recipes/${id}`, body);
  }

  setRecipeStatus(id: string, activo: boolean) {
    return this.http.patch(`${this.baseUrl}/recipes/${id}/status`, { activo });
  }

  addItem(recipeId: string, body: { productoId: string; unidadId: string; cantidad: string; modo?: string; proveedorId?: string }) {
    return this.http.post<RecipeItem>(`${this.baseUrl}/recipes/${recipeId}/items`, body);
  }

  updateItem(recipeId: string, itemId: string, body: any) {
    return this.http.patch<RecipeItem>(`${this.baseUrl}/recipes/${recipeId}/items/${itemId}`, body);
  }

  removeItem(recipeId: string, itemId: string) {
    return this.http.delete(`${this.baseUrl}/recipes/${recipeId}/items/${itemId}`);
  }

  // recipes.api.ts
  calculate(recipeId: string, body: {
    porciones?: string;
    from?: string;
    to?: string;
    overrides?: { productoId: string; precioUnitario: string }[];
  }) {
    return this.http.post<any>(`${this.baseUrl}/recipes/${recipeId}/calculate`, body);
  }

  checkQuoteAvailability(productoId: string, unidadKey: string) {
    return this.http.get<{
      available: boolean;
      count: number;
      quotes: { proveedorId: string; proveedorNombre: string; lastDate: string; precioUnidad: string }[];
    }>(`${this.baseUrl}/recipes/quote-check`, {
      params: { productoId, unidadKey },
    });
  }

  batchEstimate(ids: string[]) {
    return this.http.post<{
      id: string;
      nombre: string;
      porcionesBase: string | null;
      costoPorPorcion: string | null;
      totalReceta: string | null;
      available: boolean;
    }[]>(`${this.baseUrl}/recipes/batch-estimate`, { ids });
  }

}
