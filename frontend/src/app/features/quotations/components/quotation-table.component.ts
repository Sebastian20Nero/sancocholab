import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Quotation } from '../models/quotation.model';

@Component({
  standalone: true,
  selector: 'app-quotation-table',
  imports: [CommonModule],
  template: `
  <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:bg-gray-900 dark:border-gray-800">
    <div class="overflow-auto">
      <table class="min-w-full text-sm">
        <thead class="text-left bg-gray-50/80 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
          <tr class="text-gray-600 dark:text-gray-300 font-medium tracking-wide">
            <th class="p-4 whitespace-nowrap cursor-pointer hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors rounded-tl-lg" (click)="setSort('fecha')">
              <div class="flex items-center gap-1">Fecha <ng-container *ngTemplateOutlet="sortIcon; context: {col: 'fecha'}"></ng-container></div>
            </th>
            <th class="p-4 whitespace-nowrap cursor-pointer hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors" (click)="setSort('proveedorNombre')">
              <div class="flex items-center gap-1">Proveedor <ng-container *ngTemplateOutlet="sortIcon; context: {col: 'proveedorNombre'}"></ng-container></div>
            </th>
            <th class="p-4 whitespace-nowrap cursor-pointer hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors" (click)="setSort('productoNombre')">
              <div class="flex items-center gap-1">Producto <ng-container *ngTemplateOutlet="sortIcon; context: {col: 'productoNombre'}"></ng-container></div>
            </th>
            <th class="p-4 whitespace-nowrap cursor-pointer hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors" (click)="setSort('categoriaNombre')">
              <div class="flex items-center gap-1">Categoría <ng-container *ngTemplateOutlet="sortIcon; context: {col: 'categoriaNombre'}"></ng-container></div>
            </th>
            <th class="p-4 whitespace-nowrap">Presentación</th>
            <th class="p-4 whitespace-nowrap text-right hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer" (click)="setSort('precioPresentacion')">
              <div class="flex items-center justify-end gap-1">$ Pres. <ng-container *ngTemplateOutlet="sortIcon; context: {col: 'precioPresentacion'}"></ng-container></div>
            </th>
            <th class="p-4 whitespace-nowrap cursor-pointer hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors" (click)="setSort('cantidad')">
              <div class="flex items-center gap-1">Cantidad <ng-container *ngTemplateOutlet="sortIcon; context: {col: 'cantidad'}"></ng-container></div>
            </th>
            <th class="p-4 whitespace-nowrap">Unidad</th>
            <th class="p-4 whitespace-nowrap text-right hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer" (click)="setSort('precioUnitario')">
              <div class="flex items-center justify-end gap-1">Precio Unit. <ng-container *ngTemplateOutlet="sortIcon; context: {col: 'precioUnitario'}"></ng-container></div>
            </th>
            <th class="p-4 whitespace-nowrap text-right hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer" (click)="setSort('total')">
              <div class="flex items-center justify-end gap-1">Total <ng-container *ngTemplateOutlet="sortIcon; context: {col: 'total'}"></ng-container></div>
            </th>
            <th class="p-4 whitespace-nowrap text-center">Estado</th>
            <th class="p-4 whitespace-nowrap text-center rounded-tr-lg">Acciones</th>
          </tr>
        </thead>

      <tbody>
        <tr *ngFor="let q of sortedItems" class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/80 dark:hover:bg-gray-800/80 transition-colors">
          <td class="p-4 text-gray-900 dark:text-gray-100 whitespace-nowrap">
            {{ q.fecha | date: 'dd/MM/yyyy' }}
          </td>
          <td class="p-4 text-gray-900 dark:text-gray-100">
            <div class="flex items-center gap-2">
              <span class="text-gray-400">🏢</span>
              {{ q.proveedorNombre || '-' }}
            </div>
          </td>
          <td class="p-4 font-medium text-gray-900 dark:text-gray-100">
            {{ q.productoNombre || '-' }}
          </td>
          <td class="p-4 text-gray-600 dark:text-gray-400">
            <span class="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 dark:bg-gray-800 dark:text-gray-300">
              {{ q.categoriaNombre || 'Sin categoría' }}
            </span>
          </td>
          <td class="p-4 text-gray-600 dark:text-gray-400">
            {{ q.presentacionCompra || '-' }}
          </td>
          <td class="p-4 text-right text-gray-600 dark:text-gray-400 font-medium">
            {{ q.precioPresentacion ? formatCurrency(q.precioPresentacion) : '-' }}
          </td>
          <td class="p-4 text-gray-900 dark:text-gray-100 font-medium">
            {{ q.cantidad }}
          </td>
          <td class="p-4 text-gray-500">
            {{ q.unidadKey || q.unidadNombre || '-' }}
          </td>
          <td class="p-4 text-right font-medium text-gray-900 dark:text-gray-100">
            {{ formatCurrency(q.precioUnitario) }}
          </td>
          <td class="p-4 text-right font-bold text-gray-900 dark:text-gray-100">
            {{ formatCurrency(calculateTotal(q)) }}
          </td>
          <td class="p-4 text-center">
            <span
              class="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium shadow-sm"
              [ngClass]="q.activo ? 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50' : 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50'">
              <span class="h-1.5 w-1.5 rounded-full" [ngClass]="q.activo ? 'bg-green-600 dark:bg-green-400' : 'bg-red-600 dark:bg-red-400'"></span>
              {{ q.activo ? 'Activo' : 'Inactivo' }}
            </span>
          </td>
          <td class="p-4">
            <div class="flex items-center justify-center gap-2">
              <button
                *ngIf="q.activo"
                (click)="onEdit(q)"
                class="p-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                title="Editar">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                *ngIf="q.activo"
                (click)="onDelete(q)"
                class="p-1.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                title="Inactivar">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <span *ngIf="!q.activo" class="text-xs text-gray-400">-</span>
            </div>
          </td>
        </tr>

        <tr *ngIf="!items.length">
          <td colspan="12" class="p-12 text-center text-gray-500 bg-gray-50/30 dark:bg-gray-800/20">
            <div class="flex flex-col items-center justify-center gap-3">
              <span class="text-4xl opacity-50">📂</span>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">No hay cotizaciones para mostrar</p>
              <p class="text-xs text-gray-400 dark:text-gray-500">Intenta cambiar los filtros o crea una nueva.</p>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    </div>
    
    <!-- Sort Icon Template -->
    <ng-template #sortIcon let-col="col">
      <span class="inline-flex w-3.5 h-3.5 justify-center items-center ml-0.5">
        <!-- Unsorted (up/down arrows) -->
        <svg *ngIf="sortColumn !== col" class="text-gray-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
        </svg>
        <!-- Ascending -->
        <svg *ngIf="sortColumn === col && sortDirection === 'asc'" class="text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
        </svg>
        <!-- Descending -->
        <svg *ngIf="sortColumn === col && sortDirection === 'desc'" class="text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </ng-template>
  </div>
`,
})
export class QuotationTableComponent {
  @Input() items: Quotation[] = [];
  @Output() edit = new EventEmitter<Quotation>();
  @Output() delete = new EventEmitter<Quotation>();

  sortColumn: string = 'fecha';
  sortDirection: 'asc' | 'desc' = 'desc';

  get sortedItems(): Quotation[] {
    if (!this.items) return [];

    return [...this.items].sort((a, b) => {
      let valueA: any;
      let valueB: any;

      if (this.sortColumn === 'total') {
        valueA = parseFloat(a.precioUnitario) * parseFloat(a.cantidad);
        valueB = parseFloat(b.precioUnitario) * parseFloat(b.cantidad);
      } else {
        valueA = (a as any)[this.sortColumn];
        valueB = (b as any)[this.sortColumn];
      }

      // Handle strings
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        const compare = valueA.localeCompare(valueB);
        return this.sortDirection === 'asc' ? compare : -compare;
      }

      // Handle numbers or dates
      valueA = valueA || 0;
      valueB = valueB || 0;

      const numA = Number(valueA);
      const numB = Number(valueB);

      if (!isNaN(numA) && !isNaN(numB)) {
        return this.sortDirection === 'asc' ? numA - numB : numB - numA;
      }

      return 0;
    });
  }

  setSort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  onEdit(quotation: Quotation) {
    this.edit.emit(quotation);
  }

  onDelete(quotation: Quotation) {
    this.delete.emit(quotation);
  }

  calculateTotal(q: Quotation): string {
    const precio = parseFloat(q.precioUnitario);
    const cantidad = parseFloat(q.cantidad);
    if (isNaN(precio) || isNaN(cantidad)) return '0';
    return (precio * cantidad).toFixed(2);
  }

  formatCurrency(value: string): string {
    const num = parseFloat(value);
    if (isNaN(num)) return '$0.00';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  }
}
