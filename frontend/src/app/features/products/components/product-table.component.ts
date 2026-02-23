import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Product } from '../models/product.model';

@Component({ 
  standalone: true,
  selector: 'app-product-table',
  imports: [CommonModule],
  template: `
  <div class="overflow-auto rounded-xl border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800">
    <table class="min-w-full text-sm">
      <thead class="text-left border-b border-gray-200 dark:border-gray-800">
        <tr class="text-gray-500">
          <th class="p-3">Nombre</th>
          <th class="p-3">SKU</th>
          <th class="p-3">Categoría</th>
          <th class="p-3">Marca</th>
          <th class="p-3">Activo</th>
        </tr>
      </thead>

      <tbody>
        <tr *ngFor="let p of items" class="border-b border-gray-100 dark:border-gray-800">
          <td class="p-3 font-medium">{{ p.nombre }}</td>
          <td class="p-3">{{ p.descripcion || '-' }}</td>

          <!-- ✅ aquí debe ir el nombre, no el id -->
          <td class="p-3">{{ p.categoriaNombre || '-' }}</td>

          <!-- ✅ como no existe "marca" en tu modelo, deja un placeholder -->
          <td class="p-3">-</td>

          <!-- ✅ Activo en su propia columna -->
          <td class="p-3">
            <span
              class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
              [ngClass]="p.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
              {{ p.activo ? 'Sí' : 'No' }}
            </span>
          </td>
        </tr>

        <tr *ngIf="!items.length">
          <td class="p-4 text-gray-500" colspan="5">Sin resultados</td>
        </tr>
      </tbody>
    </table>
  </div>
`,

})
export class ProductTableComponent {
  @Input() items: Product[] = [];
}
