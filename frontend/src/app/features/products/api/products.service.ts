import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_CONFIG } from '../../../core/config/api.config';
import { map, Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { PagedResponse } from '../models/paged-response.model';
import { ProductQuery } from '../models/product-query.model';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly base = API_CONFIG.baseUrl;
  private readonly url = `${this.base}/products`;

  constructor(private http: HttpClient) {}

  list(query: ProductQuery = {}): Observable<PagedResponse<Product>> {
    let params = new HttpParams();

    if (query.q) params = params.set('q', query.q);
    if (query.activo !== undefined && query.activo !== null)
      params = params.set('activo', String(query.activo)); // ✅ true/false

    if (query.categoriaId !== undefined && query.categoriaId !== null && query.categoriaId !== '') {
    params = params.set('categoriaId', String(query.categoriaId));
  }

    if (query.page) params = params.set('page', String(query.page));
    if (query.limit) params = params.set('limit', String(query.limit));

    return this.http.get<any>(this.url, { params }).pipe(
      map((res) => {
        if (Array.isArray(res)) return { items: this.normalizeProducts(res) };
        return { ...res, items: this.normalizeProducts(res.items ?? []) } as PagedResponse<Product>;
      })
    );
  }

  private normalizeProducts(raw: any[]): Product[] {
    return (raw ?? []).map((p) => ({
        id: p.id ?? p.idProducto ?? p.uuid,

        nombre: p.nombre ?? p.name ?? 'Sin nombre',
        descripcion: p.descripcion ?? p.description ?? null,

        categoriaId: p.categoriaId ?? p.categoryId ?? (p.categoria?.idCategoria ?? null),
        categoriaNombre:
        p.categoriaNombre ??
        p.categoryName ??
        p.categoria?.nombre ??   // ✅ ESTA ES LA CLAVE
        null,

        activo: (p.activo ?? p.isActive ?? true) === true,

        createdAt: p.createdAt ?? p.created_at,
        updatedAt: p.updatedAt ?? p.updated_at,
    }));
    }
}
