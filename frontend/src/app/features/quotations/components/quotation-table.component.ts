import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Quotation } from '../models/quotation.model';

@Component({
  standalone: true,
  selector: 'app-quotation-table',
  imports: [CommonModule],
  template: `
  <div class="overflow-auto rounded-xl border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800">
    <table class="min-w-full text-sm">
      <thead class="text-left border-b border-gray-200 dark:border-gray-800">
        <tr class="text-gray-500">
          <th class="p-3">Fecha</th>
          <th class="p-3">Proveedor</th>
          <th class="p-3">Producto</th>
          <th class="p-3">Categoría</th>
          <th class="p-3">Cantidad</th>
          <th class="p-3">Unidad</th>
          <th class="p-3 text-right">Precio Unit.</th>
          <th class="p-3 text-right">Total</th>
          <th class="p-3 text-center">Estado</th>
          <th class="p-3 text-center">Acciones</th>
        </tr>
      </thead>

      <tbody>
        <tr *ngFor="let q of items" class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
          <td class="p-3 text-gray-900 dark:text-gray-100">
            {{ q.fecha | date: 'dd/MM/yyyy' }}
          </td>
          <td class="p-3 text-gray-900 dark:text-gray-100">
            {{ q.proveedorNombre || '-' }}
          </td>
          <td class="p-3 font-medium text-gray-900 dark:text-gray-100">
            {{ q.productoNombre || '-' }}
          </td>
          <td class="p-3 text-gray-600 dark:text-gray-400">
            {{ q.categoriaNombre || 'Sin categoría' }}
          </td>
          <td class="p-3 text-gray-900 dark:text-gray-100">
            {{ q.cantidad }}
          </td>
          <td class="p-3 text-gray-500">
            {{ q.unidadKey || q.unidadNombre || '-' }}
          </td>
          <td class="p-3 text-right font-medium text-gray-900 dark:text-gray-100">
            {{ formatCurrency(q.precioUnitario) }}
          </td>
          <td class="p-3 text-right font-semibold text-gray-900 dark:text-gray-100">
            {{ formatCurrency(calculateTotal(q)) }}
          </td>
          <td class="p-3 text-center">
            <span
              class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
              [ngClass]="q.activo ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'">
              {{ q.activo ? 'Activo' : 'Inactivo' }}
            </span>
          </td>
          <td class="p-3">
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
          <td class="p-4 text-center text-gray-500" colspan="10">Sin cotizaciones</td>
        </tr>
      </tbody>
    </table>
  </div>
`,
})
export class QuotationTableComponent {
  @Input() items: Quotation[] = [];
  @Output() edit = new EventEmitter<Quotation>();
  @Output() delete = new EventEmitter<Quotation>();

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
