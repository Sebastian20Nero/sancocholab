import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Category } from '../models/category.model';
import { ProductQuery } from '../models/product-query.model';

@Component({
  standalone: true,
  selector: 'app-product-filters',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form class="grid grid-cols-1 md:grid-cols-4 gap-3 items-end"
          [formGroup]="form"
          (ngSubmit)="emit()">

      <div class="md:col-span-2">
        <label class="block text-xs mb-1 text-gray-500">Buscar</label>
        <input class="w-full rounded-lg border border-gray-200 px-3 py-2 bg-white dark:bg-gray-900 dark:border-gray-800"
               placeholder="Nombre / SKU…"
               formControlName="q"/>
      </div>

      <div *ngIf="categories.length">
        <label class="block text-xs mb-1 text-gray-500">Categoría</label>
        <select class="w-full rounded-lg border border-gray-200 px-3 py-2 bg-white dark:bg-gray-900 dark:border-gray-800"
                formControlName="categoryId">
          <option [ngValue]="null">Todas</option>
          <option *ngFor="let c of categories" [ngValue]="c.id">
            {{ c.name }}
          </option>

        </select>
      </div>

      <div>
        <label class="block text-xs mb-1 text-gray-500">Estado</label>
        <select class="w-full rounded-lg border border-gray-200 px-3 py-2 bg-white dark:bg-gray-900 dark:border-gray-800"
                formControlName="activo">
          <option [ngValue]="null">Todos</option>
          <option [ngValue]="true">Activos</option>
          <option [ngValue]="false">Inactivos</option>
        </select>
      </div>

      <div class="md:col-span-4 flex gap-2">
        <button class="rounded-lg px-4 py-2 bg-brand-500 text-white hover:bg-brand-600"
                type="submit">
          Aplicar
        </button>

        <button class="rounded-lg px-4 py-2 border border-gray-200 dark:border-gray-800"
                type="button"
                (click)="reset()">
          Limpiar
        </button>
      </div>
    </form>
  `,
})
export class ProductFiltersComponent {
  @Input() categories: Category[] = [];
  @Input() initial: ProductQuery | null = null;

  @Output() changed = new EventEmitter<ProductQuery>();

  // ✅ Declaramos la propiedad sin usar this.fb todavía
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    // ✅ Inicializamos el form aquí, cuando fb ya existe
    this.form = this.fb.group({
      q: [''],
      categoryId: [null as any], // opcional (si luego filtras por categoría en backend)
      activo: [true as any],
    });
  }

  ngOnChanges() {
    if (this.initial) {
      this.form.patchValue(this.initial as any, { emitEvent: false });
    }
  }

  emit() {
  const v: any = this.form.getRawValue();

  this.changed.emit({
    q: v.q?.trim() || undefined,
    categoriaId: v.categoryId ? v.categoryId : undefined, // ✅ undefined cuando es null
    activo: v.activo,
  });
}


  reset() {
    this.form.reset({ q: '', categoryId: null, activo: true });
    this.emit();
  }
}
