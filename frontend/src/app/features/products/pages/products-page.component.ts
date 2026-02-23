import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ProductFiltersComponent } from '../components/product-filters.component';
import { ProductTableComponent } from '../components/product-table.component';
import { ProductsService } from '../api/products.service';
import { CategoriesService } from '../api/categories.service';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';
import { ProductQuery } from '../models/product-query.model';

@Component({
  standalone: true,
  selector: 'app-products-page',
  imports: [CommonModule, ProductFiltersComponent, ProductTableComponent],
  templateUrl: './products-page.component.html',
})
export class ProductsPageComponent {
  loading = signal(false);
  error = signal<string | null>(null);

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);

  query = signal<ProductQuery>({ page: 1, limit: 20, activo: true });
  total = signal<number | null>(null);

  constructor(
    private productsApi: ProductsService,
    private categoriesApi: CategoriesService
  ) {
    this.loadCategories();
    this.search();
  }

  onFiltersChange(next: ProductQuery) {
    this.query.set({ ...this.query(), ...next, page: 1 });
    this.search();
  }

  search() {
    this.loading.set(true);
    this.error.set(null);

    this.productsApi.list(this.query()).subscribe({
      next: (res) => {
        this.products.set(res.items ?? []);
        this.total.set(res.meta?.total ?? null);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(e?.error?.message ?? 'Error consultando productos');
        this.loading.set(false);
      },
    });
  }

  private loadCategories() {
    this.categoriesApi.list().subscribe({
      next: (items) => this.categories.set(items ?? []),
      error: () => this.categories.set([]),
    });
  }
}
