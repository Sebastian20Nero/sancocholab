// src/app/features/recipes/pages/recipes-list.page.ts
import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RecipesApi } from '../recipes.api';
import { Recipe } from '../models';
import { RecipeEditModalComponent } from '../components/recipe-edit-modal.component';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, RecipeEditModalComponent],
  template: `
    <div class="p-4">
      <div class="flex gap-2 items-center mb-4">
        <input
          class="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 flex-1 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
          placeholder="Buscar receta..."
          [value]="q()"
          (input)="q.set(($any($event.target).value))"
        />
        <a
          routerLink="new"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Nueva receta
        </a>
      </div>

      <div *ngIf="loading()" class="text-center py-8 text-gray-500">Cargando...</div>

      <div class="grid gap-3" *ngIf="!loading()">
        <div
          *ngFor="let r of recipes()"
          class="border-l-4 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          [style.border-left-color]="r.categoria?.color || '#6B7280'"
          [style.background-color]="getCategoryBgColor(r.categoria?.color)"
        >
          <div class="flex justify-between items-start gap-4">
            <a
              [routerLink]="['/app/recipes', r.idReceta]"
              class="flex-1 hover:text-blue-600 transition-colors"
            >
              <div class="font-semibold text-lg text-gray-900 dark:text-gray-100">
                {{ r.nombre }}
              </div>
              <div class="flex flex-wrap items-center gap-2 mt-1">
                <span
                  class="inline-block px-2 py-0.5 rounded text-xs font-medium"
                  [style.background-color]="r.categoria?.color || '#6B7280'"
                  [style.color]="'white'"
                >{{ r.categoria?.nombre ?? 'Sin categoría' }}</span>
                <span
                  class="inline-block px-2 py-0.5 rounded text-xs font-medium"
                  [class.bg-green-100]="r.activo"
                  [class.text-green-800]="r.activo"
                  [class.bg-gray-100]="!r.activo"
                  [class.text-gray-800]="!r.activo"
                >{{ r.activo ? 'Activa' : 'Inactiva' }}</span>

                <!-- Costo estimado -->
                <ng-container *ngIf="getEstimate(r.idReceta) as est">
                  <span
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
                    [class.bg-emerald-100]="est.available"
                    [class.text-emerald-800]="est.available"
                    [class.bg-gray-100]="!est.available"
                    [class.text-gray-500]="!est.available"
                  >
                    <ng-container *ngIf="est.available">
                      💰 {{ formatPrecio(est.costoPorPorcion) }}/porción
                      <span class="opacity-60">(base {{ est.porcionesBase }} porc.)</span>
                    </ng-container>
                    <ng-container *ngIf="!est.available">
                      Sin cotización completa
                    </ng-container>
                  </span>
                </ng-container>
                <span *ngIf="loadingEstimates() && !getEstimate(r.idReceta)"
                      class="inline-block px-2 py-0.5 rounded text-xs bg-gray-50 text-gray-400 animate-pulse">
                  calculando...
                </span>
              </div>
            </a>

            <div class="flex gap-2">
              <button
                (click)="editRecipe(r); $event.stopPropagation()"
                class="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                title="Editar receta"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </button>
              <button
                (click)="toggleActive(r); $event.stopPropagation()"
                [class.text-red-600]="r.activo"
                [class.text-green-600]="!r.activo"
                class="p-2 dark:hover:bg-gray-700 rounded-lg transition-colors"
                [title]="r.activo ? 'Inactivar receta' : 'Activar receta'"
              >
                <svg *ngIf="r.activo" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
                </svg>
                <svg *ngIf="!r.activo" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="!loading() && recipes().length === 0" class="text-center py-12 text-gray-500">
        No se encontraron recetas
      </div>
    </div>

    <!-- Edit Modal -->
    <app-recipe-edit-modal
      *ngIf="editingRecipe()"
      [recipe]="editingRecipe()!"
      (saved)="onRecipeEdited()"
      (closed)="editingRecipe.set(null)"
    />
  `,
})
export class RecipesListPage {
  private api = inject(RecipesApi);

  q = signal('');
  loading = signal(false);
  recipes = signal<Recipe[]>([]);
  editingRecipe = signal<Recipe | null>(null);

  loadingEstimates = signal(false);
  private estimateMap = signal<Map<string, { available: boolean; costoPorPorcion: string | null; porcionesBase: string | null }>>(new Map());

  constructor() {
    effect(() => {
      const term = this.q();
      this.loading.set(true);
      this.estimateMap.set(new Map());

      this.api.listRecipes({ q: term, page: 1, limit: 50 }).subscribe({
        next: (res) => {
          this.recipes.set(res.items);
          this.loadEstimates(res.items.map((r: Recipe) => r.idReceta.toString()));
        },
        error: () => {
          this.recipes.set([]);
          this.loading.set(false);
        },
        complete: () => this.loading.set(false),
      });
    });
  }

  private loadEstimates(ids: string[]) {
    if (!ids.length) return;
    this.loadingEstimates.set(true);
    this.api.batchEstimate(ids).subscribe({
      next: (results) => {
        const map = new Map<string, any>();
        for (const r of results) map.set(r.id, r);
        this.estimateMap.set(map);
      },
      error: () => { },
      complete: () => this.loadingEstimates.set(false),
    });
  }

  getEstimate(recipeId: any) {
    return this.estimateMap().get(String(recipeId)) ?? null;
  }

  getCategoryBgColor(color?: string): string {
    if (!color) return '#F3F4F6';
    return color + '1A';
  }

  formatPrecio(v: string | null): string {
    if (!v) return '-';
    const n = parseFloat(v);
    if (isNaN(n)) return v;
    return n.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  editRecipe(recipe: Recipe) {
    this.editingRecipe.set(recipe);
  }

  onRecipeEdited() {
    const term = this.q();
    this.loading.set(true);
    this.estimateMap.set(new Map());

    this.api.listRecipes({ q: term, page: 1, limit: 50 }).subscribe({
      next: (res) => {
        this.recipes.set(res.items);
        this.loadEstimates(res.items.map((r: Recipe) => r.idReceta.toString()));
      },
      error: () => {
        this.recipes.set([]);
        this.loading.set(false);
      },
      complete: () => this.loading.set(false),
    });
  }

  toggleActive(recipe: Recipe) {
    const newStatus = !recipe.activo;
    const action = newStatus ? 'activar' : 'inactivar';

    if (!confirm(`¿Estás seguro de ${action} la receta "${recipe.nombre}"?`)) return;

    this.api.setRecipeStatus(recipe.idReceta, newStatus).subscribe({
      next: () => {
        this.recipes.update(recipes =>
          recipes.map(r => r.idReceta === recipe.idReceta ? { ...r, activo: newStatus } : r)
        );
      },
      error: (err) => {
        console.error('Error updating recipe status:', err);
        alert(`Error al ${action} la receta`);
      }
    });
  }
}
