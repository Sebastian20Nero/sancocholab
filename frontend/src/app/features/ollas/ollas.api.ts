// src/app/features/ollas/ollas.api.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type OllaPedido = {
    idOllaPedido: string;
    nombre: string;
    fecha: string;
    notas: string | null;
    totalCosto: string | null;
    status: string;
    createdAt: string;
    itemCount?: number;
    items?: OllaPedidoItem[];
};

export type OllaPedidoItem = {
    idOllaPedidoItem: string;
    recetaId: string;
    recetaNombre: string;
    porciones: string;
    totalReceta: string | null;
    costoPorPorcion: string | null;
};

@Injectable({ providedIn: 'root' })
export class OllasApi {
    private http = inject(HttpClient);
    private base = 'http://localhost:3000';

    savePedido(body: { nombre: string; fecha: string; notas?: string; items: { recetaId: string; porciones: string }[] }) {
        return this.http.post<OllaPedido>(`${this.base}/pots/pedidos`, body);
    }

    listPedidos(params?: { page?: number; limit?: number; from?: string; to?: string }) {
        const p: any = {};
        if (params?.page) p.page = params.page;
        if (params?.limit) p.limit = params.limit;
        if (params?.from) p.from = params.from;
        if (params?.to) p.to = params.to;
        return this.http.get<{ meta: any; items: OllaPedido[] }>(`${this.base}/pots/pedidos`, { params: p });
    }

    getPedido(id: string) {
        return this.http.get<OllaPedido>(`${this.base}/pots/pedidos/${id}`);
    }
}
