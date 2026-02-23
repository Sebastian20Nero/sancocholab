import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Quotation } from '../models/quotation.model';
import { QuotationsService } from '../api/quotations.service';
import { ModalStateService } from '../../../shared/services/modal-state.service';

interface UnitOption {
    id: string;
    key: string;
    nombre: string;
}

@Component({
    standalone: true,
    selector: 'app-quotation-edit-modal',
    imports: [CommonModule, FormsModule],
    template: `
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-[999999] p-4">
        <div class="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <!-- Header -->
            <div class="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
                <div class="flex items-center justify-between">
                    <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        Editar Cotización
                    </h2>
                    <button
                        (click)="onCancel()"
                        class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Body -->
            <div class="px-6 py-4 space-y-4">
                <!-- Read-only info -->
                <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
                    <div class="text-sm">
                        <span class="text-gray-500">Proveedor:</span>
                        <span class="ml-2 font-medium text-gray-900 dark:text-gray-100">{{ quotation.proveedorNombre }}</span>
                    </div>
                    <div class="text-sm">
                        <span class="text-gray-500">Producto:</span>
                        <span class="ml-2 font-medium text-gray-900 dark:text-gray-100">{{ quotation.productoNombre }}</span>
                    </div>
                    <div class="text-sm" *ngIf="quotation.categoriaNombre">
                        <span class="text-gray-500">Categoría:</span>
                        <span class="ml-2 font-medium text-gray-900 dark:text-gray-100">{{ quotation.categoriaNombre }}</span>
                    </div>
                </div>

                <!-- Error message -->
                <div *ngIf="error()" class="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    <p class="text-sm text-red-600 dark:text-red-400">{{ error() }}</p>
                </div>

                <!-- Editable fields -->
                <div class="space-y-4">
                    <!-- Cantidad -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Cantidad <span class="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            [(ngModel)]="formData.cantidad"
                            step="0.001"
                            min="0.001"
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                            placeholder="Ej: 10.5"
                            required>
                    </div>

                    <!-- Unidad -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Unidad <span class="text-red-500">*</span>
                        </label>
                        <select
                            [(ngModel)]="formData.unidadId"
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                            required>
                            <option *ngFor="let unit of units" [value]="unit.id">
                                {{ unit.key }} - {{ unit.nombre }}
                            </option>
                        </select>
                    </div>

                    <!-- Precio Unitario -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Precio Unitario <span class="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            [(ngModel)]="formData.precioUnitario"
                            step="0.01"
                            min="0"
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                            placeholder="Ej: 2500.00"
                            required>
                        <p class="mt-1 text-sm text-gray-500">{{ formatCurrency(formData.precioUnitario) }}</p>
                    </div>

                    <!-- Fecha -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Fecha <span class="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            [(ngModel)]="formData.fecha"
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                            required>
                    </div>

                    <!-- Observación -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Observación
                        </label>
                        <textarea
                            [(ngModel)]="formData.observacion"
                            rows="3"
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                            placeholder="Notas adicionales (opcional)"></textarea>
                    </div>

                    <!-- Total calculado -->
                    <div class="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
                        <div class="flex items-center justify-between">
                            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Total:</span>
                            <span class="text-lg font-bold text-blue-600 dark:text-blue-400">
                                {{ calculateTotal() }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="sticky bottom-0 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-end gap-3">
                <button
                    (click)="onCancel()"
                    [disabled]="saving()"
                    class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50">
                    Cancelar
                </button>
                <button
                    (click)="onSave()"
                    [disabled]="saving() || !isValid()"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                    <svg *ngIf="saving()" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ saving() ? 'Guardando...' : 'Guardar Cambios' }}
                </button>
            </div>
        </div>
    </div>
    `,
})
export class QuotationEditModalComponent implements OnDestroy {
    @Input() quotation!: Quotation;
    @Input() units: UnitOption[] = [];
    @Output() saved = new EventEmitter<boolean>();
    @Output() cancelled = new EventEmitter<void>();

    saving = signal(false);
    error = signal<string | null>(null);

    formData = {
        cantidad: '',
        unidadId: '',
        precioUnitario: '',
        fecha: '',
        observacion: '',
    };

    constructor(
        private quotationsApi: QuotationsService,
        private modalStateService: ModalStateService
    ) { }

    ngOnInit() {
        this.modalStateService.openModal();
        // Initialize form with current values
        this.formData = {
            cantidad: this.quotation.cantidad,
            unidadId: this.quotation.unidadId,
            precioUnitario: this.quotation.precioUnitario,
            fecha: this.formatDateForInput(this.quotation.fecha),
            observacion: '',
        };
    }

    ngOnDestroy() {
        this.modalStateService.closeModal();
    }

    formatDateForInput(date: Date | string): string {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    isValid(): boolean {
        const cantidad = parseFloat(this.formData.cantidad);
        const precio = parseFloat(this.formData.precioUnitario);

        return (
            !isNaN(cantidad) && cantidad > 0 &&
            !isNaN(precio) && precio >= 0 &&
            !!this.formData.unidadId &&
            !!this.formData.fecha
        );
    }

    calculateTotal(): string {
        const cantidad = parseFloat(this.formData.cantidad);
        const precio = parseFloat(this.formData.precioUnitario);

        if (isNaN(cantidad) || isNaN(precio)) {
            return this.formatCurrency('0');
        }

        const total = cantidad * precio;
        return this.formatCurrency(total.toString());
    }

    formatCurrency(value: string | number): string {
        const num = typeof value === 'string' ? parseFloat(value) : value;
        if (isNaN(num)) return '$0';
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(num);
    }

    onSave() {
        if (!this.isValid()) return;

        this.saving.set(true);
        this.error.set(null);

        const cantidad = parseFloat(String(this.formData.cantidad));
        const precio = parseFloat(String(this.formData.precioUnitario));

        const updateData: any = {
            cantidad: cantidad.toFixed(3),
            unidadId: String(this.formData.unidadId),
            precioUnitario: precio.toFixed(2),
            fecha: `${this.formData.fecha}T12:00:00.000Z`,
        };

        if (this.formData.observacion?.trim()) {
            updateData.observacion = this.formData.observacion.trim();
        }

        this.quotationsApi.update(this.quotation.idCotizacion, updateData).subscribe({
            next: () => {
                this.saving.set(false);
                this.saved.emit(true);
            },
            error: (e) => {
                this.saving.set(false);
                this.error.set(e?.error?.message ?? 'Error al actualizar la cotización');
            },
        });
    }

    onCancel() {
        this.cancelled.emit();
    }
}
