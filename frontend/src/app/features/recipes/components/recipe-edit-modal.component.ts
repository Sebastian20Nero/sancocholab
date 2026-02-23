// src/app/features/recipes/components/recipe-edit-modal.component.ts
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecipesApi } from '../recipes.api';
import { Recipe, RecipeCategory } from '../models';
import { ModalStateService } from '../../../shared/services/modal-state.service';

@Component({
    selector: 'app-recipe-edit-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <!-- Backdrop -->
    <div 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999999]"
      (click)="onBackdropClick($event)"
    >
      <!-- Modal -->
      <div 
        class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden"
        (click)="$event.stopPropagation()"
      >
        <!-- Header -->
        <div 
          class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between"
          [style.background-color]="recipe.categoria?.color + '20'"
        >
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Editar Receta
          </h3>
          <button 
            (click)="close()"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="px-6 py-4 space-y-4">
          <!-- Nombre -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nombre de la receta
            </label>
            <input
              type="text"
              [(ngModel)]="formData.nombre"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
              placeholder="Ej: Arroz con pollo"
            />
          </div>

          <!-- Porciones Base -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Porciones base (opcional)
            </label>
            <input
              type="number"
              step="0.01"
              [(ngModel)]="formData.porcionesBase"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
              placeholder="Ej: 50"
            />
          </div>

          <!-- Categoría -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Categoría
            </label>
            <select
              [(ngModel)]="formData.categoriaId"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="">Sin categoría</option>
              <option *ngFor="let cat of categories()" [value]="cat.idCategoriaReceta">
                {{ cat.nombre }}
              </option>
            </select>
          </div>

          <!-- Error message -->
          <div *ngIf="error()" class="text-sm text-red-600 dark:text-red-400">
            {{ error() }}
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            (click)="close()"
            class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            [disabled]="saving()"
          >
            Cancelar
          </button>
          <button
            (click)="save()"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            [disabled]="saving() || !formData.nombre.trim()"
          >
            {{ saving() ? 'Guardando...' : 'Guardar' }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class RecipeEditModalComponent implements OnInit, OnDestroy {
    @Input() recipe!: Recipe;
    @Output() saved = new EventEmitter<void>();
    @Output() closed = new EventEmitter<void>();

    private api = inject(RecipesApi);
    private modalStateService = inject(ModalStateService);

    categories = signal<RecipeCategory[]>([]);
    saving = signal(false);
    error = signal('');

    formData = {
        nombre: '',
        porcionesBase: '',
        categoriaId: '',
    };

    ngOnInit() {
        this.modalStateService.openModal();

        // Initialize form with current values
        this.formData = {
            nombre: this.recipe.nombre,
            porcionesBase: this.recipe.porcionesBase || '',
            categoriaId: this.recipe.categoriaId || '',
        };

        // Load categories
        this.api.getCategories().subscribe({
            next: (cats) => this.categories.set(cats),
            error: () => this.categories.set([]),
        });
    }

    ngOnDestroy() {
        this.modalStateService.closeModal();
    }

    onBackdropClick(event: MouseEvent) {
        if (event.target === event.currentTarget) {
            this.close();
        }
    }

    close() {
        this.closed.emit();
    }

    save() {
        if (!this.formData.nombre.trim()) {
            this.error.set('El nombre es requerido');
            return;
        }

        this.saving.set(true);
        this.error.set('');

        const updateData: any = {
            nombre: this.formData.nombre.trim(),
        };

        if (this.formData.porcionesBase) {
            updateData.porcionesBase = this.formData.porcionesBase;
        }

        if (this.formData.categoriaId) {
            updateData.categoriaId = this.formData.categoriaId;
        } else {
            updateData.categoriaId = null;
        }

        this.api.updateRecipe(this.recipe.idReceta, updateData).subscribe({
            next: () => {
                this.saved.emit();
                this.close();
            },
            error: (err) => {
                console.error('Error updating recipe:', err);
                this.error.set(err?.error?.message || 'Error al actualizar la receta');
                this.saving.set(false);
            },
        });
    }
}
