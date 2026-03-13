import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../../../core/config/api.config';
import { catchError, map, Observable, of } from 'rxjs';
import { Supplier } from '../models/supplier.model';

@Injectable({ providedIn: 'root' })
export class SuppliersService {
    private readonly base = API_CONFIG.baseUrl;
    private readonly url = `${this.base}/providers`; // ✅ Changed from /suppliers to /providers

    constructor(private http: HttpClient) { }

    list(): Observable<Supplier[]> {
        return this.http.get<any>(this.url).pipe(
            map((res) => (Array.isArray(res) ? res : (res.items ?? []))),
            map((items: any[]) =>
                (items ?? []).map((s) => ({
                    id: s.id ?? s.idProveedor ?? s.uuid,
                    name: s.name ?? s.nombre ?? 'Sin nombre',
                    isActive: (s.isActive ?? s.activo ?? true) === true,
                }))
            ),
            catchError(() => of([]))
        );
    }

    create(data: { nit: string; nombre: string; }): Observable<Supplier> {
        return this.http.post<any>(this.url, data).pipe(
            map((s) => ({
                id: s.id ?? s.idProveedor ?? s.uuid,
                name: s.name ?? s.nombre ?? 'Sin nombre',
                isActive: (s.isActive ?? s.activo ?? true) === true,
            }))
        );
    }
}
