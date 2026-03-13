import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { QuotationFiltersComponent } from '../components/quotation-filters.component';
import { QuotationTableComponent } from '../components/quotation-table.component';
import { QuotationUploadComponent } from '../components/quotation-upload.component';
import { QuotationEditModalComponent } from '../components/quotation-edit-modal.component';
import { QuotationCreateModalComponent } from '../components/quotation-create-modal.component';
import { QuotationsService } from '../api/quotations.service';
import { SuppliersService } from '../api/suppliers.service';
import { ProductsService } from '../../products/api/products.service';
import { CategoriesService } from '../../products/api/categories.service';
import { MeasuresService } from '../api/measures.service';
import { Quotation } from '../models/quotation.model';
import { QuotationQuery } from '../models/quotation-query.model';
import { Supplier } from '../models/supplier.model';
import { of } from 'rxjs';

@Component({
    standalone: true,
    selector: 'app-quotations-page',
    imports: [CommonModule, QuotationFiltersComponent, QuotationTableComponent, QuotationUploadComponent, QuotationEditModalComponent, QuotationCreateModalComponent],
    templateUrl: './quotations-page.component.html',
})
export class QuotationsPageComponent {
    loading = signal(false);
    error = signal<string | null>(null);
    showUploadModal = signal(false);
    showCreateModal = signal(false);
    showEditModal = signal(false);
    editingQuotation = signal<Quotation | null>(null);

    quotations = signal<Quotation[]>([]);
    suppliers = signal<Supplier[]>([]);
    products = signal<any[]>([]);
    categories = signal<any[]>([]);
    units = signal<any[]>([]);

    // Summary metrics
    totalInvestment = signal<number>(0);
    uniqueSuppliersCount = signal<number>(0);
    showMetrics = signal<boolean>(true);

    query = signal<QuotationQuery>({});

    constructor(
        private quotationsApi: QuotationsService,
        private suppliersApi: SuppliersService,
        private productsApi: ProductsService,
        private categoriesApi: CategoriesService,
        private measuresApi: MeasuresService
    ) {
        this.loadDropdownData();
        // NO cargamos cotizaciones al inicio - esperamos a que el usuario aplique filtros
    }

    loadDropdownData() {
        // Load suppliers
        this.suppliersApi.list().subscribe({
            next: (items) => this.suppliers.set(items ?? []),
            error: () => this.suppliers.set([]),
        });

        // Load products
        this.productsApi.list({ activo: true }).subscribe({
            next: (res) => this.products.set(res.items ?? []),
            error: () => this.products.set([]),
        });

        // Load categories
        this.categoriesApi.list().subscribe({
            next: (items) => this.categories.set(items ?? []),
            error: () => this.categories.set([]),
        });

        // Load units — map idUnidadMedida → id para que el modal encuentre el valor en el <select>
        this.measuresApi.list().subscribe({
            next: (items) => this.units.set(
                (items ?? []).map(u => ({ id: String(u.idUnidadMedida), key: u.key, nombre: u.nombre }))
            ),
            error: () => this.units.set([]),
        });
    }

    onFiltersChange(next: QuotationQuery) {
        this.query.set(next);
        this.search();
    }

    search() {
        this.loading.set(true);
        this.error.set(null);

        const q = this.query();
        const apiQuery: any = {
            proveedorId: q.proveedorId,
            productoId: q.productoId,
            categoriaId: q.categoriaId,   // ✅ el backend filtra directamente via Prisma
            from: q.from,
            to: q.to,
        };

        this.quotationsApi.list(apiQuery).subscribe({
            next: (res) => {
                const results = res ?? [];
                this.quotations.set(results);
                this.calculateMetrics(results);
                this.loading.set(false);
            },
            error: (e) => {
                this.error.set(e?.error?.message ?? 'Error consultando cotizaciones');
                this.loading.set(false);
            },
        });
    }

    openUploadModal() {
        this.showUploadModal.set(true);
    }

    closeUploadModal(uploaded: boolean) {
        this.showUploadModal.set(false);
        // Refresh data if upload was successful
        if (uploaded) {
            this.loadDropdownData();
            if (Object.keys(this.query()).length > 0) {
                this.search();
            }
        }
    }

    openCreateModal() {
        this.loadDropdownData();
        this.showCreateModal.set(true);
    }

    closeCreateModal(created: boolean) {
        this.showCreateModal.set(false);
        if (created) {
            // Recargar proveedores por si se creó uno nuevo
            this.loadDropdownData();
            // Buscar si ya hay filtro, o buscar directo? Mejor buscar si ya hay filtro
            if (Object.keys(this.query()).length > 0) {
                this.search();
            } else {
                // O forzar búsqueda vacía para ver la nueva,
                // pero como el filtro por defecto rige, mejor dejar que el usuario busque
            }
        }
    }

    onEdit(quotation: Quotation) {
        this.loadDropdownData();
        this.editingQuotation.set(quotation);
        this.showEditModal.set(true);
    }

    closeEditModal(saved: boolean) {
        this.showEditModal.set(false);
        this.editingQuotation.set(null);
        // Refresh data if save was successful
        if (saved && Object.keys(this.query()).length > 0) {
            this.search();
        }
    }

    toggleMetrics() {
        this.showMetrics.update(s => !s);
    }

    onDelete(quotation: Quotation) {
        const confirmed = confirm(
            `¿Está seguro de inactivar esta cotización?\n\n` +
            `Producto: ${quotation.productoNombre}\n` +
            `Proveedor: ${quotation.proveedorNombre}\n` +
            `Precio: ${this.formatCurrency(quotation.precioUnitario)}\n\n` +
            `Esta acción marcará la cotización como inactiva.`
        );

        if (!confirmed) return;

        this.quotationsApi.delete(quotation.idCotizacion).subscribe({
            next: () => {
                // Refresh the list
                this.search();
                alert('Cotización inactivada exitosamente');
            },
            error: (e) => {
                alert(e?.error?.message ?? 'Error al inactivar la cotización');
            },
        });
    }

    private calculateMetrics(data: Quotation[]) {
        let total = 0;
        const uniqueSuppliers = new Set<string>();

        for (const q of data) {
            const precio = parseFloat(q.precioUnitario);
            const cantidad = parseFloat(q.cantidad);
            if (!isNaN(precio) && !isNaN(cantidad)) {
                total += (precio * cantidad);
            }
            if (q.proveedorId) {
                uniqueSuppliers.add(String(q.proveedorId));
            }
        }

        this.totalInvestment.set(total);
        this.uniqueSuppliersCount.set(uniqueSuppliers.size);
    }

    formatCurrency(value: string | number): string {
        const num = typeof value === 'string' ? parseFloat(value) : value;
        if (isNaN(num)) return '$0.00';
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(num);
    }
}
