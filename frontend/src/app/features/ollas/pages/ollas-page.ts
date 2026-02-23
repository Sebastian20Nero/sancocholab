import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RecipesApi } from '../../recipes/recipes.api';
import { OllasApi, OllaPedido } from '../ollas.api';

type OllaItem = {
  recipeId: string;
  nombre: string;
  porciones: number;
  resultado: { totalReceta: string; costoPorPorcion: string; items: any[] } | null;
  calculando: boolean;
  error: string | null;
};

const TEMPLATE = /* html */`
<div class="p-4 max-w-screen-xl mx-auto">
  <!-- Header -->
  <div class="flex items-center gap-3 mb-5">
    <span class="text-3xl">🍲</span>
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Ollas</h1>
      <p class="text-sm text-gray-500">Planifica la producción del día y guarda el historial.</p>
    </div>
  </div>

  <!-- Tabs -->
  <div class="flex gap-1 mb-5 border-b">
    <button
      class="px-4 py-2 text-sm font-medium transition-colors"
      [class.border-b-2]="activeTab() === 'calculadora'"
      [class.border-blue-600]="activeTab() === 'calculadora'"
      [class.text-blue-600]="activeTab() === 'calculadora'"
      [class.text-gray-500]="activeTab() !== 'calculadora'"
      (click)="activeTab.set('calculadora')"
    >🧮 Calculadora</button>
    <button
      class="px-4 py-2 text-sm font-medium transition-colors"
      [class.border-b-2]="activeTab() === 'historial'"
      [class.border-blue-600]="activeTab() === 'historial'"
      [class.text-blue-600]="activeTab() === 'historial'"
      [class.text-gray-500]="activeTab() !== 'historial'"
      (click)="activeTab.set('historial'); loadHistorial()"
    >📋 Historial</button>
  </div>

  <!-- ══════════════════ TAB CALCULADORA ══════════════════ -->
  <div *ngIf="activeTab() === 'calculadora'" class="grid gap-4 lg:grid-cols-2">

    <!-- Buscador -->
    <div class="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm">
      <div class="font-semibold mb-3">Buscar receta</div>
      <input
        class="border p-2 w-full rounded mb-3"
        placeholder="Nombre de la receta..."
        [value]="searchQ()"
        (input)="searchQ.set($any($event.target).value)"
      />
      <div class="text-xs text-gray-400 mb-2" *ngIf="searching()">Buscando...</div>
      <div class="grid gap-2 max-h-72 overflow-y-auto">
        <div
          class="border rounded p-3 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          *ngFor="let r of searchResults()"
          (click)="prepareAdd(r)"
        >
          <div class="font-medium">{{ r.nombre }}</div>
          <div class="text-xs text-gray-400 mt-0.5">Base: {{ r.porcionesBase ?? '—' }} porciones</div>
        </div>
      </div>
      <!-- Sub-form porciones -->
      <div class="border-t mt-4 pt-3" *ngIf="adding()">
        <div class="font-medium mb-2">Agregar: <strong>{{ adding()!.nombre }}</strong></div>
        <div class="flex gap-2 items-center flex-wrap">
          <label class="text-sm">Porciones:</label>
          <input class="border p-2 w-24 rounded" type="number" min="1"
            [value]="addPorciones()" (input)="addPorciones.set(+($any($event.target).value))" />
          <button class="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" (click)="confirmAdd()">Agregar</button>
          <button class="px-3 py-2 border rounded" (click)="adding.set(null)">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- La olla -->
    <div class="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm">
      <div class="flex items-center justify-between mb-3">
        <div class="font-semibold">La olla del día</div>
        <div class="flex gap-2 flex-wrap">
          <button *ngIf="olla().length"
            class="px-3 py-1.5 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700"
            (click)="calcularTodo()" [disabled]="calculandoAlguno()">
            {{ calculandoAlguno() ? 'Calculando...' : 'Calcular todo' }}
          </button>
          <button *ngIf="hayResultados()"
            class="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            (click)="abrirGuardar()" [disabled]="guardando()">
            {{ guardando() ? 'Guardando...' : '💾 Guardar olla' }}
          </button>
          <button *ngIf="olla().length" class="px-3 py-1.5 border rounded text-sm" (click)="limpiarOlla()">Limpiar</button>
        </div>
      </div>

      <div *ngIf="!olla().length" class="text-sm text-gray-400 py-8 text-center">
        Agrega recetas desde el panel izquierdo
      </div>

      <div class="grid gap-3">
        <div class="border rounded p-3" *ngFor="let item of olla(); let i = index">
          <div class="flex justify-between items-start gap-2">
            <div class="flex-1">
              <div class="font-medium">{{ item.nombre }}</div>
              <div class="text-sm text-gray-500">Porciones: <strong>{{ item.porciones }}</strong></div>
              <div class="text-xs text-gray-400 animate-pulse" *ngIf="item.calculando">Calculando...</div>
              <div class="text-xs text-red-500" *ngIf="item.error">{{ item.error }}</div>
              <ng-container *ngIf="item.resultado as res">
                <div class="text-sm mt-1">
                  Total: <strong class="text-emerald-700">{{ formatPrecio(res.totalReceta) }}</strong>
                  · Costo/porción: <strong>{{ formatPrecio(res.costoPorPorcion) }}</strong>
                </div>
              </ng-container>
            </div>
            <div class="flex flex-col gap-1 items-end shrink-0">
              <input class="border p-1 w-20 rounded text-right text-sm" type="number" min="1"
                [value]="item.porciones" (change)="updatePorciones(i, +($any($event.target).value))" />
              <button class="text-xs text-red-500 hover:underline" (click)="removeFromOlla(i)">Quitar</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Totales -->
      <div class="border-t mt-4 pt-3" *ngIf="hayResultados()">
        <div class="font-semibold mb-1">Resumen de producción</div>
        <div class="text-sm">Recetas: <strong>{{ olla().length }}</strong> · Porciones: <strong>{{ totalPorciones() }}</strong></div>
        <div class="text-lg font-bold text-emerald-700 mt-1">Costo total: {{ formatPrecio(totalCosto()) }}</div>
      </div>
    </div>

  </div>

  <!-- Modal guardar -->
  <div *ngIf="mostrarGuardar()" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl">
      <h2 class="text-lg font-bold mb-4">Guardar olla</h2>
      <div class="grid gap-3">
        <div>
          <label class="text-sm font-medium block mb-1">Nombre *</label>
          <input class="border p-2 w-full rounded" [value]="guardarNombre()"
            (input)="guardarNombre.set($any($event.target).value)"
            placeholder="ej: Producción 21 Feb" />
        </div>
        <div>
          <label class="text-sm font-medium block mb-1">Fecha *</label>
          <input class="border p-2 w-full rounded" type="date" [value]="guardarFecha()"
            (input)="guardarFecha.set($any($event.target).value)" />
        </div>
        <div>
          <label class="text-sm font-medium block mb-1">Notas</label>
          <textarea class="border p-2 w-full rounded" rows="2" [value]="guardarNotas()"
            (input)="guardarNotas.set($any($event.target).value)"
            placeholder="Observaciones opcionales..."></textarea>
        </div>
        <div *ngIf="errorGuardar()" class="text-sm text-red-500">{{ errorGuardar() }}</div>
      </div>
      <div class="flex gap-2 justify-end mt-4">
        <button class="px-4 py-2 border rounded" (click)="mostrarGuardar.set(false)">Cancelar</button>
        <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          (click)="confirmarGuardar()" [disabled]="guardando()">
          {{ guardando() ? 'Guardando...' : 'Guardar' }}
        </button>
      </div>
    </div>
  </div>

  <!-- ══════════════════ TAB HISTORIAL ══════════════════ -->
  <div *ngIf="activeTab() === 'historial'">
    <div class="flex gap-2 mb-4 flex-wrap">
      <input class="border p-2 rounded text-sm" type="date" [value]="historialFrom()"
        (input)="historialFrom.set($any($event.target).value)" placeholder="Desde" />
      <input class="border p-2 rounded text-sm" type="date" [value]="historialTo()"
        (input)="historialTo.set($any($event.target).value)" placeholder="Hasta" />
      <button class="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700" (click)="loadHistorial()">Filtrar</button>
    </div>

    <div class="text-sm text-gray-400 py-6 text-center" *ngIf="historialLoading()">Cargando historial...</div>
    <div class="text-sm text-gray-400 py-6 text-center" *ngIf="!historialLoading() && historial().length === 0">
      No hay ollas guardadas
    </div>

    <div class="grid gap-3" *ngIf="!historialLoading()">
      <div
        class="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm cursor-pointer hover:border-blue-400 transition-colors"
        *ngFor="let h of historial()"
        (click)="toggleDetalle(h.idOllaPedido)"
      >
        <div class="flex justify-between items-start gap-3">
          <div class="flex-1">
            <div class="font-semibold">{{ h.nombre }}</div>
            <div class="text-xs text-gray-400 mt-0.5">
              {{ h.fecha | date:'dd/MM/yyyy' }} ·
              {{ h.itemCount ?? 0 }} receta(s)
            </div>
          </div>
          <div class="text-right shrink-0">
            <div class="text-emerald-700 font-bold" *ngIf="h.totalCosto">{{ formatPrecio(h.totalCosto) }}</div>
            <div class="text-gray-400 text-xs" *ngIf="!h.totalCosto">Sin costo</div>
            <div class="text-xs mt-0.5 px-2 py-0.5 rounded-full inline-block"
              [class.bg-blue-100]="h.status === 'GUARDADA'"
              [class.text-blue-700]="h.status === 'GUARDADA'"
            >{{ h.status }}</div>
          </div>
        </div>

        <!-- Detalle expandible -->
        <div *ngIf="detalleAbierto() === h.idOllaPedido" class="mt-3 border-t pt-3">
          <div class="text-xs text-gray-400 animate-pulse" *ngIf="detalleLoading()">Cargando detalle...</div>
          <div class="grid gap-2" *ngIf="detalleActual() as det">
            <div *ngIf="det.notas" class="text-sm text-gray-500 italic">{{ det.notas }}</div>
            <table class="w-full text-sm">
              <thead class="text-xs text-gray-500">
                <tr>
                  <th class="text-left py-1">Receta</th>
                  <th class="text-right py-1">Porciones</th>
                  <th class="text-right py-1">Total</th>
                  <th class="text-right py-1">$/porción</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let it of det.items" class="border-t">
                  <td class="py-1">{{ it.recetaNombre }}</td>
                  <td class="text-right py-1">{{ it.porciones }}</td>
                  <td class="text-right py-1 text-emerald-700 font-medium">{{ it.totalReceta ? formatPrecio(it.totalReceta) : '—' }}</td>
                  <td class="text-right py-1">{{ it.costoPorPorcion ? formatPrecio(it.costoPorPorcion) : '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`;

@Component({ standalone: true, imports: [CommonModule, DatePipe], template: TEMPLATE })
export class OllasPage {
  private recipesApi = inject(RecipesApi);
  private ollasApi = inject(OllasApi);

  activeTab = signal<'calculadora' | 'historial'>('calculadora');

  // ─── Calculadora ───
  searchQ = signal('');
  searching = signal(false);
  searchResults = signal<any[]>([]);
  adding = signal<{ id: any; nombre: string } | null>(null);
  addPorciones = signal(50);
  olla = signal<OllaItem[]>([]);

  calculandoAlguno = computed(() => this.olla().some(o => o.calculando));
  hayResultados = computed(() => this.olla().some(o => o.resultado !== null));
  totalPorciones = computed(() => this.olla().reduce((s, o) => s + o.porciones, 0));
  totalCosto = computed(() => {
    const t = this.olla().filter(o => o.resultado).reduce((s, o) => s + parseFloat(o.resultado!.totalReceta || '0'), 0);
    return t.toFixed(2);
  });

  // ─── Guardar modal ───
  mostrarGuardar = signal(false);
  guardarNombre = signal('');
  guardarFecha = signal(new Date().toISOString().slice(0, 10));
  guardarNotas = signal('');
  guardando = signal(false);
  errorGuardar = signal('');

  // ─── Historial ───
  historial = signal<OllaPedido[]>([]);
  historialLoading = signal(false);
  historialFrom = signal('');
  historialTo = signal('');
  detalleAbierto = signal<string | null>(null);
  detalleLoading = signal(false);
  detalleActual = signal<OllaPedido | null>(null);

  constructor() {
    this.doSearch('');
    effect(() => {
      const q = this.searchQ();
      this.doSearch(q);
    });
  }

  private doSearch(q: string) {
    this.searching.set(true);
    this.recipesApi.listRecipes({ q: q || undefined, page: 1, limit: 20, activo: true }).subscribe({
      next: (res) => this.searchResults.set(res.items ?? []),
      error: () => this.searchResults.set([]),
      complete: () => this.searching.set(false),
    });
  }

  prepareAdd(recipe: any) {
    this.adding.set({ id: recipe.idReceta, nombre: recipe.nombre });
    this.addPorciones.set(recipe.porcionesBase ? Math.round(parseFloat(recipe.porcionesBase)) : 50);
  }

  confirmAdd() {
    const a = this.adding();
    if (!a) return;
    if (this.olla().some(o => o.recipeId === String(a.id))) { alert('Ya está en la olla.'); return; }
    this.olla.update(items => [...items, { recipeId: String(a.id), nombre: a.nombre, porciones: this.addPorciones(), resultado: null, calculando: false, error: null }]);
    this.adding.set(null);
  }

  removeFromOlla(i: number) { this.olla.update(items => items.filter((_, idx) => idx !== i)); }

  updatePorciones(i: number, v: number) {
    this.olla.update(items => items.map((it, idx) => idx === i ? { ...it, porciones: v || 1, resultado: null, error: null } : it));
  }

  limpiarOlla() { this.olla.set([]); }

  calcularTodo() {
    this.olla().forEach((item, i) => {
      this.olla.update(l => l.map((it, idx) => idx === i ? { ...it, calculando: true, error: null, resultado: null } : it));
      this.recipesApi.calculate(item.recipeId, { porciones: String(item.porciones) }).subscribe({
        next: (res) => this.olla.update(l => l.map((it, idx) => idx === i ? { ...it, calculando: false, resultado: { totalReceta: res.totalReceta, costoPorPorcion: res.costoPorPorcion, items: res.items }, error: null } : it)),
        error: (e) => this.olla.update(l => l.map((it, idx) => idx === i ? { ...it, calculando: false, resultado: null, error: e?.error?.message ?? 'Sin cotizaciones.' } : it)),
      });
    });
  }

  // ─── Guardar ───
  abrirGuardar() {
    this.guardarNombre.set(`Producción ${new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })}`);
    this.guardarFecha.set(new Date().toISOString().slice(0, 10));
    this.guardarNotas.set('');
    this.errorGuardar.set('');
    this.mostrarGuardar.set(true);
  }

  confirmarGuardar() {
    if (!this.guardarNombre().trim()) { this.errorGuardar.set('El nombre es requerido.'); return; }
    if (!this.guardarFecha()) { this.errorGuardar.set('La fecha es requerida.'); return; }

    this.guardando.set(true);
    this.errorGuardar.set('');

    const items = this.olla().map(o => ({ recetaId: o.recipeId, porciones: String(o.porciones) }));
    this.ollasApi.savePedido({ nombre: this.guardarNombre().trim(), fecha: this.guardarFecha(), notas: this.guardarNotas().trim() || undefined, items }).subscribe({
      next: () => {
        this.guardando.set(false);
        this.mostrarGuardar.set(false);
        alert('✅ Olla guardada correctamente.');
      },
      error: (e) => {
        this.guardando.set(false);
        this.errorGuardar.set(e?.error?.message ?? 'Error al guardar la olla.');
      },
    });
  }

  // ─── Historial ───
  loadHistorial() {
    this.historialLoading.set(true);
    this.historial.set([]);
    this.detalleAbierto.set(null);
    this.detalleActual.set(null);
    this.ollasApi.listPedidos({ from: this.historialFrom() || undefined, to: this.historialTo() || undefined }).subscribe({
      next: (res) => this.historial.set(res.items),
      error: () => { },
      complete: () => this.historialLoading.set(false),
    });
  }

  toggleDetalle(id: string) {
    if (this.detalleAbierto() === id) { this.detalleAbierto.set(null); return; }
    this.detalleAbierto.set(id);
    this.detalleActual.set(null);
    this.detalleLoading.set(true);
    this.ollasApi.getPedido(id).subscribe({
      next: (d) => { this.detalleActual.set(d); this.detalleLoading.set(false); },
      error: () => this.detalleLoading.set(false),
    });
  }

  formatPrecio(v: string | null | number): string {
    if (v === null || v === undefined) return '-';
    const n = typeof v === 'string' ? parseFloat(v) : v;
    if (isNaN(n)) return String(v);
    return n.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }
}
