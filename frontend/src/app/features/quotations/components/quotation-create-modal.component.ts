import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuotationsService } from '../api/quotations.service';
import { SuppliersService } from '../api/suppliers.service';
import { ProductsService } from '../../products/api/products.service';
import { MeasuresService } from '../api/measures.service';
import { ModalStateService } from '../../../shared/services/modal-state.service';
import { Supplier } from '../models/supplier.model';

interface UnitOption {
    id: string;
    key: string;
    nombre: string;
}

@Component({
    standalone: true,
    selector: 'app-quotation-create-modal',
    imports: [CommonModule, FormsModule],
    template: `
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-[999999] p-4">
        <div class="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <!-- Header -->
            <div class="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
                <div>
                    <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        📝 Nueva Cotización
                    </h2>
                    <p class="text-sm text-gray-500">Ingresa los detalles para registrar una cotización individual.</p>
                </div>
                <button
                    (click)="onCancel()"
                    class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Body -->
            <div class="px-6 py-4 space-y-6">
                <!-- Error message -->
                <div *ngIf="error()" class="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    <p class="text-sm text-red-600 dark:text-red-400">{{ error() }}</p>
                </div>

                <div class="space-y-4">
                    <!-- Fecha y Producto -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <div>
                            <div class="flex items-center justify-between mb-1">
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Producto <span class="text-red-500">*</span>
                                </label>
                                <button *ngIf="!creatingProduct()" type="button" (click)="toggleProductMode()" class="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                                    <span>➕</span> Nuevo Producto
                                </button>
                                <button *ngIf="creatingProduct()" type="button" (click)="toggleProductMode()" class="text-xs text-gray-500 hover:underline flex items-center gap-1">
                                    <span>🔙</span> Volver a la lista
                                </button>
                            </div>

                            <div *ngIf="!creatingProduct()">
                                <select
                                    [(ngModel)]="formData.productoId"
                                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                                    required>
                                    <option value="" disabled selected>Seleccione un producto...</option>
                                    <option *ngFor="let p of products" [value]="p.id">
                                        {{ p.nombre }}
                                    </option>
                                </select>
                            </div>

                            <div *ngIf="creatingProduct()" class="animate-fade-in-up">
                                <input type="text" [(ngModel)]="newProduct.nombre" placeholder="Ej: Acetaminofén 500mg" class="w-full px-3 py-2 border border-blue-300 dark:border-blue-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100">
                            </div>
                        </div>
                    </div>

                    <!-- Proveedor Section -->
                    <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-800">
                        <div class="flex items-center justify-between mb-3">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Proveedor <span class="text-red-500">*</span>
                            </label>
                            <button *ngIf="!creatingProvider()" type="button" (click)="toggleProviderMode()" class="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                                <span>➕</span> Nuevo Proveedor
                            </button>
                            <button *ngIf="creatingProvider()" type="button" (click)="toggleProviderMode()" class="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:underline flex items-center gap-1">
                                <span>🔙</span> Volver a la lista
                            </button>
                        </div>

                        <div *ngIf="!creatingProvider()">
                            <select
                                [(ngModel)]="formData.proveedorId"
                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                                required>
                                <option value="" disabled selected>Seleccione un proveedor de la lista...</option>
                                <option *ngFor="let s of suppliers" [value]="s.id">
                                    {{ s.name }}
                                </option>
                            </select>
                        </div>

                        <div *ngIf="creatingProvider()" class="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up">
                            <div>
                                <label class="block text-xs font-medium text-gray-500 mb-1">NIT</label>
                                <input type="text" [(ngModel)]="newProvider.nit" placeholder="Ej: 900.123.456-7" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100">
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-gray-500 mb-1">Nombre del Proveedor</label>
                                <input type="text" [(ngModel)]="newProvider.nombre" placeholder="Ej: Distribuidora El Sol S.A." class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100">
                            </div>
                        </div>
                    </div>

                    <!-- Presentación -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Presentación (Opcional)
                            </label>
                            <input
                                type="text"
                                [(ngModel)]="formData.presentacionCompra"
                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                                placeholder="Ej: Caja Mágica x 12, Paca, Bulto">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Precio Presentación (Opcional)
                            </label>
                            <input
                                type="number"
                                [(ngModel)]="formData.precioPresentacion"
                                step="0.01"
                                min="0"
                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                                placeholder="Ej: 50000">
                            <p class="mt-1 text-xs text-gray-500">{{ formData.precioPresentacion ? formatCurrency(formData.precioPresentacion) : 'Recomendado si hay presentación' }}</p>
                        </div>
                    </div>

                    <!-- Cantidad, Unidad y Total -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                placeholder="Ej: 5.5"
                                required>
                        </div>
                        <!-- Unidad Section -->
                        <div>
                            <div class="flex items-center justify-between mb-1">
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Unidad <span class="text-red-500">*</span>
                                </label>
                                <button *ngIf="!creatingUnit()" type="button" (click)="toggleUnitMode()" class="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                                    <span>➕</span> Nueva Unidad
                                </button>
                                <button *ngIf="creatingUnit()" type="button" (click)="toggleUnitMode()" class="text-xs text-gray-500 hover:underline flex items-center gap-1">
                                    <span>🔙</span> Volver a la lista
                                </button>
                            </div>

                            <div *ngIf="!creatingUnit()">
                                <select
                                    [(ngModel)]="formData.unidadId"
                                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                                    required>
                                    <option value="" disabled selected>Seleccione...</option>
                                    <option *ngFor="let unit of units" [value]="unit.id">
                                        {{ unit.key }} - {{ unit.nombre }}
                                    </option>
                                </select>
                            </div>

                            <div *ngIf="creatingUnit()" class="grid grid-cols-2 gap-2 animate-fade-in-up">
                                <div>
                                    <input type="text" [(ngModel)]="newUnit.key" placeholder="Sigla (Ej: KG)" class="w-full px-3 py-2 border border-blue-300 dark:border-blue-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 uppercase">
                                </div>
                                <div>
                                    <input type="text" [(ngModel)]="newUnit.nombre" placeholder="Nombre (Ej: Kilogramo)" class="w-full px-3 py-2 border border-blue-300 dark:border-blue-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100">
                                </div>
                            </div>
                        </div>

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
                                placeholder="Ej: 12500"
                                required>
                            <p class="mt-1 text-xs text-gray-500 font-medium text-blue-600 dark:text-blue-400">Tot: {{ calculateTotal() }}</p>
                        </div>
                    </div>

                    <!-- Observación -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Observación
                        </label>
                        <textarea
                            [(ngModel)]="formData.observacion"
                            rows="2"
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                            placeholder="Notas adicionales sobre la cotización (opcional)"></textarea>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="sticky bottom-0 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-end gap-3 rounded-b-xl">
                <button
                    (click)="onCancel()"
                    [disabled]="saving()"
                    class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 flex items-center gap-2">
                    <span>❌</span> Cancelar
                </button>
                <button
                    (click)="onSave()"
                    [disabled]="saving() || !isValid()"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm">
                    <span *ngIf="saving()">⏳</span>
                    <span *ngIf="!saving()">💾</span>
                    {{ saving() ? 'Guardando...' : 'Guardar Cotización' }}
                </button>
            </div>
        </div>
    </div>
    `
})
export class QuotationCreateModalComponent implements OnInit, OnDestroy {
    @Input() units: UnitOption[] = [];
    @Input() suppliers: Supplier[] = [];
    @Input() products: any[] = [];
    @Output() saved = new EventEmitter<boolean>();
    @Output() cancelled = new EventEmitter<void>();

    saving = signal(false);
    error = signal<string | null>(null);
    creatingProvider = signal(false);
    creatingProduct = signal(false);
    creatingUnit = signal(false);

    formData = {
        fecha: '',
        productoId: '',
        proveedorId: '',
        presentacionCompra: '',
        precioPresentacion: '',
        cantidad: '',
        unidadId: '',
        precioUnitario: '',
        observacion: '',
    };

    newProvider = {
        nit: '',
        nombre: ''
    };

    newProduct = {
        nombre: ''
    };

    newUnit = {
        key: '',
        nombre: ''
    };

    constructor(
        private quotationsApi: QuotationsService,
        private suppliersApi: SuppliersService,
        private productsApi: ProductsService,
        private measuresApi: MeasuresService,
        private modalStateService: ModalStateService
    ) { }

    ngOnInit() {
        this.modalStateService.openModal();
        this.formData.fecha = this.formatDateForInput(new Date());
    }

    ngOnDestroy() {
        this.modalStateService.closeModal();
    }

    toggleSubjectMode(type: 'provider' | 'product' | 'unit') {
        if (type === 'provider') {
            this.creatingProvider.set(!this.creatingProvider());
            if (this.creatingProvider()) {
                this.formData.proveedorId = '';
            } else {
                this.newProvider.nit = '';
                this.newProvider.nombre = '';
            }
        } else if (type === 'product') {
            this.creatingProduct.set(!this.creatingProduct());
            if (this.creatingProduct()) {
                this.formData.productoId = '';
            } else {
                this.newProduct.nombre = '';
            }
        } else if (type === 'unit') {
            this.creatingUnit.set(!this.creatingUnit());
            if (this.creatingUnit()) {
                this.formData.unidadId = '';
            } else {
                this.newUnit.key = '';
                this.newUnit.nombre = '';
            }
        }
    }

    toggleProviderMode() {
        this.toggleSubjectMode('provider');
    }

    toggleProductMode() {
        this.toggleSubjectMode('product');
    }

    toggleUnitMode() {
        this.toggleSubjectMode('unit');
    }

    formatDateForInput(d: Date): string {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    isValid(): boolean {
        const cantidad = parseFloat(this.formData.cantidad);
        const precio = parseFloat(this.formData.precioUnitario);

        const hasProveedor = this.creatingProvider()
            ? (this.newProvider.nit.trim().length >= 3 && this.newProvider.nombre.trim().length >= 2)
            : !!this.formData.proveedorId;

        const hasProducto = this.creatingProduct()
            ? (this.newProduct.nombre.trim().length >= 2)
            : !!this.formData.productoId;

        const hasUnit = this.creatingUnit()
            ? (this.newUnit.key.trim().length >= 1 && this.newUnit.nombre.trim().length >= 2)
            : !!this.formData.unidadId;

        return (
            !!this.formData.fecha &&
            hasProducto &&
            hasProveedor &&
            hasUnit &&
            !isNaN(cantidad) && cantidad > 0 &&
            !isNaN(precio) && precio >= 0
        );
    }

    calculateTotal(): string {
        const cantidad = parseFloat(this.formData.cantidad);
        const precio = parseFloat(this.formData.precioUnitario);

        if (isNaN(cantidad) || isNaN(precio)) {
            return this.formatCurrency('0');
        }

        return this.formatCurrency((cantidad * precio).toString());
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

    async onSave() {
        if (!this.isValid()) return;
        this.saving.set(true);
        this.error.set(null);

        try {
            let finalProveedorId = this.formData.proveedorId;
            let finalProductoId = this.formData.productoId;
            let finalUnidadId = this.formData.unidadId;

            // 1. Create provider if needed
            if (this.creatingProvider()) {
                const createdProv = await new Promise<Supplier>((resolve, reject) => {
                    this.suppliersApi.create(this.newProvider).subscribe({
                        next: resolve,
                        error: reject
                    });
                });
                finalProveedorId = createdProv.id;
            }

            // 1.5 Create product if needed
            if (this.creatingProduct()) {
                const createdProd = await new Promise<any>((resolve, reject) => {
                    this.productsApi.create(this.newProduct).subscribe({
                        next: resolve,
                        error: reject
                    });
                });
                finalProductoId = String(createdProd.id);
            }

            // 1.7 Create unit if needed
            if (this.creatingUnit()) {
                const createdUnit = await new Promise<any>((resolve, reject) => {
                    this.measuresApi.create(this.newUnit).subscribe({
                        next: resolve,
                        error: reject
                    });
                });
                finalUnidadId = String(createdUnit.idUnidadMedida ?? createdUnit.id);
            }

            // 2. Prepare quotation data
            const cantidad = parseFloat(String(this.formData.cantidad));
            const precio = parseFloat(String(this.formData.precioUnitario));

            const createData: any = {
                proveedorId: finalProveedorId,
                productoId: finalProductoId,
                unidadId: finalUnidadId,
                cantidad: cantidad.toFixed(3),
                precioUnitario: precio.toFixed(2),
                fecha: `${this.formData.fecha}T12:00:00.000Z`,
            };

            if (this.formData.presentacionCompra?.trim()) {
                createData.presentacionCompra = this.formData.presentacionCompra.trim();
            }

            if (this.formData.precioPresentacion) {
                createData.precioPresentacion = parseFloat(String(this.formData.precioPresentacion)).toFixed(2);
            }

            if (this.formData.observacion?.trim()) {
                createData.observacion = this.formData.observacion.trim();
            }

            // 3. Create quotation
            await new Promise<void>((resolve, reject) => {
                this.quotationsApi.create(createData).subscribe({
                    next: () => resolve(),
                    error: reject
                });
            });

            this.saving.set(false);
            this.saved.emit(true);

        } catch (e: any) {
            this.saving.set(false);
            this.error.set(e?.error?.message ?? 'Error inesperado guardando la cotización');
        }
    }

    onCancel() {
        this.cancelled.emit();
    }
}
