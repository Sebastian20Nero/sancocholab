import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../../../core/config/api.config';
import { Observable } from 'rxjs';

export interface MeasureUnit {
    idUnidadMedida: string;
    key: string;
    nombre: string;
    activo: boolean;
}

@Injectable({ providedIn: 'root' })
export class MeasuresService {
    private readonly base = API_CONFIG.baseUrl;
    private readonly url = `${this.base}/measures`;

    constructor(private http: HttpClient) { }

    list(): Observable<MeasureUnit[]> {
        return this.http.get<MeasureUnit[]>(this.url);
    }
}
