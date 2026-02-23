// src/app/features/recipes/pages/recipe-create.page.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RecipesApi } from '../recipes.api';
import { RecipeCategory } from '../models';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4 max-w-xl">
      <h2 class="text-xl font-semibold mb-4">Crear receta</h2>

      <div class="grid gap-3">
        <input class="border p-2" placeholder="Nombre" [value]="nombre()" (input)="nombre.set($any($event.target).value)" />

        <select class="border p-2" [value]="categoriaId()" (change)="categoriaId.set($any($event.target).value)">
          <option value="">-- Selecciona categoría --</option>
          <option *ngFor="let c of categorias()" [value]="c.idCategoriaReceta">{{ c.nombre }}</option>
        </select>

        <input class="border p-2" placeholder="Porciones base (opcional)" [value]="porcionesBase()" (input)="porcionesBase.set($any($event.target).value)" />

        <button class="border p-2" (click)="guardar()" [disabled]="saving()">
          {{ saving() ? 'Guardando...' : 'Guardar' }}
        </button>

        <div class="text-red-600" *ngIf="error()">{{ error() }}</div>
      </div>
    </div>
  `,
})
export class RecipeCreatePage {
  private api = inject(RecipesApi);
  private router = inject(Router);

  categorias = signal<RecipeCategory[]>([]);
  nombre = signal('');
  categoriaId = signal('');
  porcionesBase = signal('');
  saving = signal(false);
  error = signal('');

  constructor() {
    this.api.getCategories().subscribe({
      next: (cats) => this.categorias.set(cats),
      error: () => this.categorias.set([]),
    });
  }

  guardar() {
    this.error.set('');
    if (this.nombre().trim().length < 3) {
      this.error.set('El nombre debe tener al menos 3 caracteres');
      return;
    }

    this.saving.set(true);
    this.api.createRecipe({
      nombre: this.nombre().trim(),
      categoriaId: this.categoriaId() || undefined,
      porcionesBase: this.porcionesBase() || undefined,
    }).subscribe({
      next: (r) => this.router.navigate(['/app/recipes', r.idReceta]),
      error: (e) => this.error.set('No se pudo crear la receta (¿nombre duplicado?)'),
      complete: () => this.saving.set(false),
    });
  }
}
