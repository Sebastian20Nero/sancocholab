import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { QuotationQuery } from '../models/quotation-query.model';
import { Supplier } from '../models/supplier.model';

@Component({
  standalone: true,
  selector: 'app-quotation-filters',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form class="grid grid-cols-1 md:grid-cols-4 gap-3 items-end"
          [formGroup]="form"
          (ngSubmit)="emit()">

      <div *ngIf="suppliers.length">
        <label class="block text-xs mb-1 text-gray-500">Proveedor</label>
        <select class="w-full rounded-lg border border-gray-200 px-3 py-2 bg-white dark:bg-gray-900 dark:border-gray-800"
                formControlName="proveedorId">
          <option [ngValue]="null">Todos los proveedores</option>
          <option *ngFor="let s of suppliers" [ngValue]="s.id">
            {{ s.name }}
          </option>
        </select>
      </div>

      <div *ngIf="categories.length">
        <label class="block text-xs mb-1 text-gray-500">Categoría</label>
        <select class="w-full rounded-lg border border-gray-200 px-3 py-2 bg-white dark:bg-gray-900 dark:border-gray-800"
                formControlName="categoriaId"
                (change)="onCategoryChange()">
          <option [ngValue]="null">Todas las categorías</option>
          <option *ngFor="let c of categories" [ngValue]="c.id">
            {{ c.name }}
          </option>
        </select>
      </div>

      <div *ngIf="products.length">
        <label class="block text-xs mb-1 text-gray-500">Producto</label>
        <select class="w-full rounded-lg border border-gray-200 px-3 py-2 bg-white dark:bg-gray-900 dark:border-gray-800"
                formControlName="productoId">
          <option [ngValue]="null">Todos los productos</option>
          <option *ngFor="let p of filteredProducts" [ngValue]="p.id">
            {{ p.nombre }}
          </option>
        </select>
      </div>

      <div>
        <label class="block text-xs mb-1 text-gray-500">Desde</label>
        <input class="w-full rounded-lg border border-gray-200 px-3 py-2 bg-white dark:bg-gray-900 dark:border-gray-800"
               type="date"
               formControlName="from"/>
      </div>

      <div>
        <label class="block text-xs mb-1 text-gray-500">Hasta</label>
        <input class="w-full rounded-lg border border-gray-200 px-3 py-2 bg-white dark:bg-gray-900 dark:border-gray-800"
               type="date"
               formControlName="to"/>
      </div>

      <div class="md:col-span-4 flex gap-2">
        <button class="rounded-lg px-4 py-2 bg-brand-500 text-white hover:bg-brand-600"
                type="submit">
          Aplicar Filtros
        </button>

        <button class="rounded-lg px-4 py-2 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                type="button"
                (click)="reset()">
          Limpiar
        </button>
      </div>
    </form>
  `,
})
export class QuotationFiltersComponent implements OnChanges {
  @Input() initial: QuotationQuery | null = null;
  @Input() suppliers: Supplier[] = [];
  @Input() products: any[] = [];
  @Input() categories: any[] = [];

  @Output() changed = new EventEmitter<QuotationQuery>();

  form: FormGroup;
  filteredProducts: any[] = [];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      proveedorId: [null],
      productoId: [null],
      categoriaId: [null],
      from: [''],
      to: [''],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['products'] && this.products) {
      this.updateFilteredProducts();
    }

    if (this.initial) {
      this.form.patchValue(this.initial as any, { emitEvent: false });
      this.updateFilteredProducts();
    }
  }

  onCategoryChange() {
    // Reset product selection when category changes
    this.form.patchValue({ productoId: null });
    this.updateFilteredProducts();
  }

  updateFilteredProducts() {
    const selectedCategoryId = this.form.get('categoriaId')?.value;

    if (selectedCategoryId) {
      // Filter products by selected category
      this.filteredProducts = this.products.filter(
        p => String(p.categoriaId) === String(selectedCategoryId)
      );
    } else {
      // Show all products if no category selected
      this.filteredProducts = [...this.products];
    }
  }

  emit() {
    const v: any = this.form.getRawValue();

    this.changed.emit({
      proveedorId: v.proveedorId || undefined,
      productoId: v.productoId || undefined,
      categoriaId: v.categoriaId || undefined,
      from: v.from || undefined,
      to: v.to || undefined,
    });
  }

  reset() {
    this.form.reset({ proveedorId: null, productoId: null, categoriaId: null, from: '', to: '' });
    this.updateFilteredProducts();
    this.emit();
  }
}
