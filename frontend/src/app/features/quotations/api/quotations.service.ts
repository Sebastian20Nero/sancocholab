import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_CONFIG } from '../../../core/config/api.config';
import { Observable } from 'rxjs';
import { Quotation } from '../models/quotation.model';
import { QuotationQuery } from '../models/quotation-query.model';

@Injectable({ providedIn: 'root' })
export class QuotationsService {
    private readonly base = API_CONFIG.baseUrl;
    private readonly url = `${this.base}/quotes`;

    constructor(private http: HttpClient) { }

    list(query: QuotationQuery = {}): Observable<Quotation[]> {
        let params = new HttpParams();

        if (query.proveedorId) params = params.set('proveedorId', query.proveedorId);
        if (query.productoId) params = params.set('productoId', query.productoId);
        if (query.categoriaId) params = params.set('categoriaId', query.categoriaId);
        if (query.from) params = params.set('from', query.from);
        if (query.to) params = params.set('to', query.to);

        return this.http.get<Quotation[]>(this.url, { params });
    }

    update(id: string, data: Partial<Quotation>): Observable<Quotation> {
        return this.http.put<Quotation>(`${this.url}/${id}`, data);
    }

    delete(id: string): Observable<Quotation> {
        return this.http.delete<Quotation>(`${this.url}/${id}`);
    }
}
