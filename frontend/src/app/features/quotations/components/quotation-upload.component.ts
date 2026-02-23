import { Component, EventEmitter, Output, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuotationUploadService, BulkUploadResult } from '../api/quotation-upload.service';
import { ModalStateService } from '../../../shared/services/modal-state.service';

@Component({
  standalone: true,
  selector: 'app-quotation-upload',
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999999]">
      <div class="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h2 class="text-xl font-semibold">Importar Cotizaciones desde Excel</h2>
          <button 
            (click)="close()"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            [disabled]="uploading()"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-6">
          <!-- Step 1: Download Template -->
          <div class="mb-6">
            <h3 class="font-medium mb-2">Paso 1: Descarga la plantilla</h3>
            <button
              (click)="downloadTemplate()"
              [disabled]="uploading()"
              class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Descargar Plantilla Excel
            </button>
          </div>

          <!-- Step 2: Upload File -->
          <div class="mb-6">
            <h3 class="font-medium mb-2">Paso 2: Sube el archivo completado</h3>
            <div class="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
              <input
                #fileInput
                type="file"
                accept=".xlsx,.xls"
                (change)="onFileSelected($event)"
                class="hidden"
                [disabled]="uploading()"
              />
              
              <div *ngIf="!selectedFile()">
                <svg class="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                </svg>
                <button
                  (click)="fileInput.click()"
                  [disabled]="uploading()"
                  class="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-50"
                >
                  Seleccionar Archivo
                </button>
                <p class="text-sm text-gray-500 mt-2">Solo archivos .xlsx o .xls (Máx 5MB)</p>
              </div>

              <div *ngIf="selectedFile()" class="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded">
                <div class="flex items-center gap-2">
                  <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  <div class="text-left">
                    <p class="font-medium">{{ selectedFile()?.name }}</p>
                    <p class="text-sm text-gray-500">{{ formatFileSize(selectedFile()?.size || 0) }}</p>
                  </div>
                </div>
                <button
                  (click)="clearFile()"
                  [disabled]="uploading()"
                  class="text-red-500 hover:text-red-700"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            <div *ngIf="fileError()" class="mt-2 text-red-500 text-sm">
              {{ fileError() }}
            </div>
          </div>

          <!-- Upload Progress -->
          <div *ngIf="uploading()" class="mb-6">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium">Procesando...</span>
              <span class="text-sm text-gray-500">{{ uploadProgress() }}%</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                class="bg-brand-500 h-2 rounded-full transition-all duration-300"
                [style.width.%]="uploadProgress()"
              ></div>
            </div>
          </div>

          <!-- Results -->
          <div *ngIf="uploadResult()" class="mb-6">
            <h3 class="font-medium mb-3">Resultados de la Carga</h3>
            
            <!-- Summary -->
            <div class="grid grid-cols-2 gap-3 mb-4">
              <div class="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ uploadResult()?.success }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Exitosas</div>
              </div>
              <div class="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                <div class="text-2xl font-bold text-red-600 dark:text-red-400">{{ uploadResult()?.failed }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Fallidas</div>
              </div>
            </div>

            <!-- Created Entities -->
            <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4">
              <div class="text-sm font-medium mb-2">Entidades Creadas:</div>
              <div class="grid grid-cols-2 gap-2 text-sm">
                <div>Proveedores: <strong>{{ uploadResult()?.created?.providers || 0 }}</strong></div>
                <div>Productos: <strong>{{ uploadResult()?.created?.products || 0 }}</strong></div>
                <div>Categorías: <strong>{{ uploadResult()?.created?.categories || 0 }}</strong></div>
                <div>Cotizaciones: <strong>{{ uploadResult()?.created?.quotations || 0 }}</strong></div>
              </div>
            </div>

            <!-- Errors -->
            <div *ngIf="uploadResult()?.errors && uploadResult()!.errors.length > 0" class="max-h-64 overflow-y-auto">
              <div class="text-sm font-medium mb-2 text-red-600 dark:text-red-400">
                Errores ({{ uploadResult()!.errors.length }}):
              </div>
              <div class="space-y-2">
                <div 
                  *ngFor="let error of uploadResult()!.errors"
                  class="bg-red-50 dark:bg-red-900/20 p-2 rounded text-sm"
                >
                  <strong>Fila {{ error.row }}</strong> - {{ error.field }}: {{ error.message }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-2">
          <button
            (click)="close()"
            [disabled]="uploading()"
            class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
          >
            {{ uploadResult() ? 'Cerrar' : 'Cancelar' }}
          </button>
          <button
            *ngIf="!uploadResult()"
            (click)="upload()"
            [disabled]="!selectedFile() || uploading()"
            class="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ uploading() ? 'Subiendo...' : 'Subir y Procesar' }}
          </button>
          <button
            *ngIf="uploadResult()"
            (click)="reset()"
            class="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600"
          >
            Subir Otro Archivo
          </button>
        </div>
      </div>
    </div>
  `,
})
export class QuotationUploadComponent implements OnInit, OnDestroy {
  @Output() closed = new EventEmitter<boolean>(); // true if uploaded successfully

  selectedFile = signal<File | null>(null);
  fileError = signal<string>('');
  uploading = signal(false);
  uploadProgress = signal(0);
  uploadResult = signal<BulkUploadResult | null>(null);

  constructor(
    private uploadService: QuotationUploadService,
    private modalStateService: ModalStateService
  ) { }

  ngOnInit() {
    this.modalStateService.openModal();
  }

  ngOnDestroy() {
    this.modalStateService.closeModal();
  }

  downloadTemplate() {
    this.uploadService.downloadTemplate().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cotizaciones_template.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.fileError.set('Error al descargar la plantilla');
        console.error(err);
      },
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      this.fileError.set('Solo se permiten archivos Excel (.xlsx, .xls)');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.fileError.set('El archivo no debe exceder 5MB');
      return;
    }

    this.selectedFile.set(file);
    this.fileError.set('');
  }

  clearFile() {
    this.selectedFile.set(null);
    this.fileError.set('');
  }

  upload() {
    const file = this.selectedFile();
    if (!file) return;

    this.uploading.set(true);
    this.uploadProgress.set(0);
    this.uploadResult.set(null);

    this.uploadService.uploadFileWithProgress(file).subscribe({
      next: (event) => {
        this.uploadProgress.set(event.progress);
        if (event.result) {
          this.uploadResult.set(event.result);
          this.uploading.set(false);
        }
      },
      error: (err) => {
        this.uploading.set(false);
        this.fileError.set(err.error?.message || 'Error al procesar el archivo');
        console.error(err);
      },
    });
  }

  reset() {
    this.selectedFile.set(null);
    this.fileError.set('');
    this.uploadResult.set(null);
    this.uploadProgress.set(0);
  }

  close() {
    const success = !!this.uploadResult()?.success;
    this.closed.emit(success);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}
