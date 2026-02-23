import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../../../core/config/api.config';
import { catchError, map, Observable, of } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private readonly base = API_CONFIG.baseUrl;
  private readonly url = `${this.base}/categories`;

  constructor(private http: HttpClient) {}

  list(): Observable<Category[]> {
    return this.http.get<any>(this.url).pipe(
      map((res) => (Array.isArray(res) ? res : (res.items ?? []))),
      map((items: any[]) =>
        (items ?? []).map((c) => ({
          id: c.id ?? c.idCategoria ?? c.uuid,
          name: c.name ?? c.nombre ?? 'Sin nombre',
          isActive: (c.isActive ?? c.activo ?? true) === true,
        }))
      ),
      // Si no existe endpoint, no tumbamos el módulo
      catchError(() => of([]))
    );
  }
}
