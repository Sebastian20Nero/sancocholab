import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { API_CONFIG } from '../../../core/config/api.config';
import { Observable, map } from 'rxjs';

export interface BulkUploadResult {
    processed: number;
    success: number;
    failed: number;
    created: {
        providers: number;
        products: number;
        categories: number;
        quotations: number;
    };
    errors: Array<{
        row: number;
        field: string;
        value: any;
        message: string;
    }>;
}

@Injectable({ providedIn: 'root' })
export class QuotationUploadService {
    private readonly base = API_CONFIG.baseUrl;

    constructor(private http: HttpClient) { }

    /**
     * Downloads the Excel template file
     */
    downloadTemplate(): Observable<Blob> {
        return this.http.get(`${this.base}/quotes/template`, {
            responseType: 'blob',
        });
    }

    /**
     * Uploads Excel file and returns the result
     */
    uploadFile(file: File): Observable<BulkUploadResult> {
        const formData = new FormData();
        formData.append('file', file);

        return this.http.post<BulkUploadResult>(
            `${this.base}/quotes/bulk-upload`,
            formData
        );
    }

    /**
     * Uploads Excel file with progress tracking
     */
    uploadFileWithProgress(file: File): Observable<{ progress: number; result?: BulkUploadResult }> {
        const formData = new FormData();
        formData.append('file', file);

        return this.http.post<BulkUploadResult>(
            `${this.base}/quotes/bulk-upload`,
            formData,
            {
                reportProgress: true,
                observe: 'events',
            }
        ).pipe(
            map((event: HttpEvent<any>) => {
                if (event.type === HttpEventType.UploadProgress) {
                    const progress = event.total ? Math.round((100 * event.loaded) / event.total) : 0;
                    return { progress };
                } else if (event.type === HttpEventType.Response) {
                    return { progress: 100, result: event.body };
                }
                return { progress: 0 };
            })
        );
    }
}
