import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RecipesApi } from '../recipes.api';
import { debounceTime, switchMap, of, Subject, Subscription } from 'rxjs';

// ─────────────────────────────────────────────────────────────
// NOTA: NO usar ${ } dentro del template string — rompe TS.
// Usar solo {{ }} de Angular.
// ─────────────────────────────────────────────────────────────

const TEMPLATE = /* html */`
  <div
    class="p-4 mx-auto max-w-screen-2xl md:p-6 min-h-screen transition-colors"
    [style.background-color]="getCategoryBgColor(recipe()?.categoria?.color)"
    *ngIf="recipe() as r; else loadingTpl"
  >

    <!-- Header -->
    <div class="flex items-start justify-between gap-3 mb-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border-l-4"
         [style.border-left-color]="r.categoria?.color || '#6B7280'">
      <div class="flex-1">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ r.nombre }}</h2>
        <div class="flex items-center gap-2 mt-2">
          <span
            class="inline-block px-3 py-1 rounded-full text-sm font-medium text-white"
            [style.background-color]="r.categoria?.color || '#6B7280'"
          >{{ r.categoria?.nombre ?? 'Sin categoría' }}</span>
          <span
            class="inline-block px-3 py-1 rounded-full text-sm font-medium"
            [class.bg-green-100]="r.activo"
            [class.text-green-800]="r.activo"
            [class.bg-gray-100]="!r.activo"
            [class.text-gray-800]="!r.activo"
          >{{ r.activo ? 'Activa' : 'Inactiva' }}</span>
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400 mt-2" *ngIf="r.porcionesBase">
          Porciones base: {{ r.porcionesBase }}
        </div>
      </div>

      <button
        class="px-4 py-2 rounded-lg font-medium text-white transition-colors"
        [class.bg-red-600]="r.activo"
        [class.bg-green-600]="!r.activo"
        (click)="toggleStatus()"
        [disabled]="toggling()"
      >{{ toggling() ? '...' : (r.activo ? 'Inactivar' : 'Activar') }}</button>
    </div>

    <!-- Info -->
    <div class="border rounded p-3 bg-gray-50 text-sm mb-4">
      <div class="font-semibold mb-1">¿Qué hace esta pantalla?</div>
      <ul class="list-disc pl-5 space-y-1 opacity-80">
        <li>Agregas ingredientes con una <b>cantidad base</b> y una <b>unidad</b> (KG / L / UND).</li>
        <li>Si hay cotizaciones, puedes elegir un <b>proveedor específico</b> (modo BY_PROVIDER).</li>
        <li>Luego defines <b>porciones</b> para escalar la receta.</li>
        <li>El sistema calcula el costo usando <b>cotizaciones</b> o un <b>override de precio</b>.</li>
      </ul>
    </div>

    <!-- Agregar ingrediente -->
    <div class="border p-3 rounded mb-4">
      <div class="font-semibold mb-2">Agregar ingrediente</div>

      <div class="flex gap-2 items-center mb-2">
        <input
          class="border p-2 flex-1 rounded"
          placeholder="Buscar producto..."
          [value]="prodQ()"
          (input)="prodQ.set(($any($event.target).value))"
        />
        <button class="border px-3 py-2 rounded" (click)="buscarProducto()" [disabled]="searchingProducts()">
          {{ searchingProducts() ? '...' : 'Buscar' }}
        </button>
      </div>

      <div class="grid gap-2 md:grid-cols-3">

        <!-- Producto -->
        <select class="border p-2 rounded" [value]="selectedProductId()"
                (change)="onProductChange($any($event.target).value)">
          <option value="">-- Producto --</option>
          <option *ngFor="let p of products()" [value]="p.idProducto">{{ p.nombre }}</option>
        </select>

        <!-- Unidad -->
        <select class="border p-2 rounded" [value]="selectedMeasureId()"
                (change)="onMeasureChange($any($event.target).value)">
          <option value="">-- Unidad --</option>
          <option *ngFor="let m of canonicalMeasures()" [value]="m.idUnidadMedida">{{ m.key }} - {{ m.nombre }}</option>
        </select>

        <!-- Proveedor: solo cuando hay cotizaciones -->
        <select class="border p-2 rounded" [value]="selectedProveedorId()"
                (change)="selectedProveedorId.set($any($event.target).value)"
                *ngIf="quoteCheck()?.available">
          <option value="">-- Proveedor (opcional) --</option>
          <option *ngFor="let q of quoteCheck()?.quotes" [value]="q.proveedorId">
            {{ q.proveedorNombre }} — {{ formatPrecio(q.precioUnidad) }}/{{ selectedMeasureKey() }}
          </option>
        </select>

        <!-- Indicador de cotización disponible -->
        <div class="col-span-full mt-1">

          <div *ngIf="checkingQuote()" class="text-xs text-gray-400">
            Verificando cotizaciones...
          </div>

          <ng-container *ngIf="!checkingQuote() && quoteCheck() as qc">

            <ng-container *ngIf="qc.available">
              <!-- Proveedor seleccionado: su precio específico -->
              <div *ngIf="selectedProveedorQuote() as sq"
                   class="text-xs text-green-700 bg-green-50 border border-green-200 rounded p-2">
                <strong>{{ sq.proveedorNombre }}</strong>
                — Precio: <strong>{{ formatPrecio(sq.precioUnidad) }}/{{ selectedMeasureKey() }}</strong>
                · Cotización: {{ sq.lastDate | date:'dd/MM/yyyy' }}
              </div>
              <!-- Sin proveedor: listar todos -->
              <div *ngIf="!selectedProveedorQuote()"
                   class="text-xs text-green-700 bg-green-50 border border-green-200 rounded p-2">
                <strong>{{ qc.count }} proveedor(es) con cotización:</strong>
                {{ formatQuotes(qc.quotes, selectedMeasureKey()) }}
              </div>
            </ng-container>

            <div *ngIf="!qc.available"
                 class="text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded p-2">
              Sin cotización para esta combinación — se requerirá precio manual (override)
            </div>
          </ng-container>
        </div>

        <!-- Cantidad -->
        <input
          class="border p-2 rounded"
          placeholder="Cantidad base (ej: 2 o 2.5)"
          [value]="qty()"
          (input)="qty.set(($any($event.target).value))"
        />
      </div>

      <div class="text-sm text-red-600 mt-2" *ngIf="addError()">{{ addError() }}</div>

      <div class="mt-2 flex items-center gap-2">
        <button class="border px-3 py-2 rounded" (click)="agregarItem()" [disabled]="adding()">
          {{ adding() ? 'Agregando...' : 'Agregar ingrediente' }}
        </button>
        <button class="border px-3 py-2 rounded" type="button" (click)="resetAddForm()" [disabled]="adding()">
          Limpiar
        </button>
        <div class="text-xs opacity-70" *ngIf="measures().length === 0">(No hay medidas cargadas)</div>
      </div>
    </div>

    <!-- Calculadora -->
    <div class="border p-3 rounded mb-4">
      <div class="flex gap-2 items-center mb-3">
        <label class="text-sm">Porciones:</label>
        <input
          class="border p-2 w-28 rounded"
          [value]="porciones()"
          (input)="porciones.set(($any($event.target).value))"
          placeholder="50"
        />
        <button class="border px-3 py-2 rounded" (click)="calcular()" [disabled]="calculando()">
          {{ calculando() ? 'Calculando...' : 'Calcular' }}
        </button>
        <button class="border px-3 py-2 rounded" type="button" (click)="resetOverrides()">
          Reset overrides
        </button>
      </div>

      <div class="text-sm text-red-600 mb-2" *ngIf="calcError()">{{ calcError() }}</div>

      <div class="mb-2 font-semibold">Ingredientes</div>

      <div class="grid gap-2" *ngIf="r.items?.length; else noItemsTpl">
        <div class="border p-2 rounded" *ngFor="let it of r.items">
          <div class="flex items-start gap-3">

            <!-- Info -->
            <div class="flex-1">
              <div class="font-medium">
                {{ it.producto?.nombre ?? ('Producto ' + it.productoId) }}
              </div>
              <div class="text-xs opacity-70 mt-0.5">
                Cantidad base: {{ it.cantidad }} {{ it.unidad?.key ?? it.unidadId }}
              </div>
              <div class="text-xs mt-0.5">
                <span class="font-semibold">{{ it.modo ?? 'AUTO' }}</span>
                <ng-container *ngIf="it.proveedor">
                  · <span class="text-blue-700 font-medium">{{ it.proveedor.nombre }}</span>
                </ng-container>
                <ng-container *ngIf="!it.proveedor">
                  · <span class="opacity-50">Mejor precio disponible</span>
                </ng-container>
              </div>
              <!-- indicador post-calcular -->
              <div class="text-xs mt-1"
                [ngClass]="{
                  'text-green-600': priceStatus(it.productoId) === 'QUOTE',
                  'text-yellow-600': priceStatus(it.productoId) === 'OVERRIDE',
                  'text-red-600': priceStatus(it.productoId) === 'MISSING'
                }">
                {{ priceLabel(it.productoId) }}
                <ng-container *ngIf="priceValue(it.productoId) as pv">
                  — <strong>{{ pv }}/{{ it.unidad?.key }}</strong>
                </ng-container>
              </div>
            </div>

            <!-- Override + quitar -->
            <div class="flex flex-col items-end gap-1 shrink-0">
              <label class="text-xs opacity-60">Override precio unit.</label>
              <input
                class="border p-2 w-36 rounded text-right"
                [value]="getOverride(it.productoId)"
                (input)="setOverride(it.productoId, $any($event.target).value)"
                placeholder="5000.00"
              />
              <button
                class="border px-3 py-1 rounded text-xs"
                type="button"
                (click)="removeItem(it.idRecetaItem)"
                [disabled]="removingItemId() === it.idRecetaItem">
                {{ removingItemId() === it.idRecetaItem ? '...' : 'Quitar' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <ng-template #noItemsTpl>
        <div class="text-xs opacity-70">Agrega ingredientes para poder calcular.</div>
      </ng-template>
    </div>

    <!-- Resultado del cálculo -->
    <div class="border p-3 rounded mb-4" *ngIf="calc() as c">
      <div class="font-semibold mb-2">Resultado</div>
      <div class="text-sm mb-3">
        Total receta: <b>{{ formatPrecio(c.totalReceta) }}</b><br/>
        Costo por porción: <b>{{ formatPrecio(c.costoPorPorcion) }}</b>
      </div>
      <div class="grid gap-2">
        <div class="border p-2 rounded text-sm" *ngFor="let x of c.items">
          <div class="font-medium">{{ x.producto }}</div>
          <div class="opacity-80 text-xs mt-0.5">
            Cantidad: {{ x.cantidad }} {{ x.unidadKey }}<br/>
            Precio unit: {{ formatPrecio(x.precioUnitario) }}/{{ x.unidadKey }}
            <span class="opacity-60">({{ x.source?.type }})</span><br/>
            Total: <b>{{ formatPrecio(x.total) }}</b>
          </div>
        </div>
      </div>
    </div>

  </div>

  <ng-template #loadingTpl>
    <div class="p-4" *ngIf="loading()">Cargando...</div>
    <div class="p-4 text-sm text-red-600" *ngIf="!loading() && !recipe()">No se pudo cargar la receta.</div>
  </ng-template>
`;

@Component({
  standalone: true,
  imports: [CommonModule],
  template: TEMPLATE,
})
export class RecipeDetailPage {
  private api = inject(RecipesApi);
  private route = inject(ActivatedRoute);

  loading = signal(false);
  recipe = signal<any>(null);

  removingItemId = signal<string | null>(null);
  removeError = signal('');

  products = signal<any[]>([]);
  measures = signal<any[]>([]);
  prodQ = signal('');
  searchingProducts = signal(false);

  selectedProductId = signal('');
  selectedMeasureId = signal('');
  selectedProveedorId = signal('');
  qty = signal('1');
  adding = signal(false);
  addError = signal('');

  quoteCheck = signal<{
    available: boolean;
    count: number;
    quotes: { proveedorId: string; proveedorNombre: string; lastDate: string; precioUnidad: string }[];
  } | null>(null);
  checkingQuote = signal(false);
  private quoteCheck$ = new Subject<{ productoId: string; measureId: string }>();
  private quoteCheckSub?: Subscription;

  toggling = signal(false);

  porciones = signal('50');
  calculando = signal(false);
  calc = signal<any>(null);
  calcError = signal('');

  private overrideMap = signal<Record<string, string>>({});

  constructor() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.cargarReceta(id);

    this.api.getMeasures().subscribe({
      next: (m) => this.measures.set(m ?? []),
      error: () => this.measures.set([]),
    });

    this.api.getProducts({ page: 1, limit: 20 }).subscribe({
      next: (res) => this.products.set(res?.items ?? []),
      error: () => this.products.set([]),
    });

    this.route.paramMap.subscribe(pm => {
      const newId = pm.get('id');
      if (newId && this.recipe()?.idReceta !== newId) {
        this.cargarReceta(newId);
        this.calc.set(null);
        this.calcError.set('');
        this.overrideMap.set({});
      }
    });

    effect(() => {
      const pid = this.selectedProductId();
      const mid = this.selectedMeasureId();
      if (pid && mid) {
        this.quoteCheck$.next({ productoId: pid, measureId: mid });
      } else {
        this.quoteCheck.set(null);
        this.selectedProveedorId.set('');
      }
    });

    this.quoteCheckSub = this.quoteCheck$.pipe(
      debounceTime(300),
      switchMap(({ productoId, measureId }) => {
        const measure = this.canonicalMeasures().find((m: any) => m.idUnidadMedida === measureId);
        if (!measure) return of(null);
        this.checkingQuote.set(true);
        this.selectedProveedorId.set('');
        return this.api.checkQuoteAvailability(productoId, measure.key);
      }),
    ).subscribe({
      next: (res) => { this.quoteCheck.set(res); this.checkingQuote.set(false); },
      error: () => { this.quoteCheck.set(null); this.checkingQuote.set(false); },
    });
  }

  getCategoryBgColor(color?: string): string {
    if (!color) return '#F9FAFB';
    return color + '0D';
  }

  private cargarReceta(id: string) {
    this.loading.set(true);
    this.api.getRecipe(id).subscribe({
      next: (r) => this.recipe.set(r),
      error: () => this.recipe.set(null),
      complete: () => this.loading.set(false),
    });
  }

  getOverride(productoId: string) { return this.overrideMap()[productoId] ?? ''; }

  setOverride(productoId: string, value: string) {
    const m = { ...this.overrideMap() };
    m[productoId] = value;
    this.overrideMap.set(m);
  }

  buscarProducto() {
    this.searchingProducts.set(true);
    const q = this.prodQ().trim();
    this.api.getProducts({ page: 1, limit: 20, q: q || undefined }).subscribe({
      next: (res) => this.products.set(res?.items ?? []),
      error: () => this.products.set([]),
      complete: () => this.searchingProducts.set(false),
    });
  }

  onProductChange(value: string) {
    this.selectedProductId.set(value);
    this.selectedProveedorId.set('');
    this.quoteCheck.set(null);
  }

  onMeasureChange(value: string) {
    this.selectedMeasureId.set(value);
    this.selectedProveedorId.set('');
  }

  agregarItem() {
    const r = this.recipe();
    if (!r) return;

    this.addError.set('');
    if (!this.selectedProductId()) { this.addError.set('Selecciona un producto'); return; }
    if (!this.selectedMeasureId()) { this.addError.set('Selecciona una unidad'); return; }
    if (!this.qty().trim()) { this.addError.set('Ingresa cantidad'); return; }

    const proveedorId = this.selectedProveedorId();
    const body: any = {
      productoId: this.selectedProductId(),
      unidadId: this.selectedMeasureId(),
      cantidad: this.qty().trim(),
      modo: proveedorId ? 'BY_PROVIDER' : 'AUTO',
    };
    if (proveedorId) body.proveedorId = proveedorId;

    this.adding.set(true);
    this.api.addItem(r.idReceta, body).subscribe({
      next: () => {
        this.api.getRecipe(r.idReceta).subscribe(rr => this.recipe.set(rr));
        this.resetAddForm();
      },
      error: (e) => this.addError.set(e?.error?.message ?? 'No se pudo agregar ingrediente'),
      complete: () => this.adding.set(false),
    });
  }

  toggleStatus() {
    const r = this.recipe();
    if (!r) return;
    this.toggling.set(true);
    this.api.setRecipeStatus(r.idReceta, !r.activo).subscribe({
      next: () => this.api.getRecipe(r.idReceta).subscribe(rr => this.recipe.set(rr)),
      error: () => { },
      complete: () => this.toggling.set(false),
    });
  }

  calcular() {
    const r = this.recipe();
    if (!r) return;
    this.calcError.set('');
    this.calculando.set(true);

    const overrides = Object.entries(this.overrideMap())
      .filter(([, v]) => v?.toString().trim().length > 0)
      .map(([productoId, precioUnitario]) => ({ productoId, precioUnitario: precioUnitario.trim() }));

    this.api.calculate(r.idReceta, {
      porciones: this.porciones().trim() || undefined,
      overrides: overrides.length ? overrides : undefined,
    }).subscribe({
      next: (res) => this.calc.set(res),
      error: (e) => {
        this.calcError.set((e?.error?.message ?? 'No se pudo calcular.') + ' (Tip: ingresa override de precio y recalcula)');
        this.calc.set(null);
      },
      complete: () => this.calculando.set(false),
    });
  }

  priceStatus(productoId: string): 'QUOTE' | 'OVERRIDE' | 'MISSING' {
    const c = this.calc();
    if (!c?.items?.length) return 'MISSING';
    const found = c.items.find((x: any) => x.productoId === productoId);
    if (!found) return 'MISSING';
    const t = found.source?.type;
    if (t === 'QUOTE' || t === 'BY_PROVIDER' || t === 'AUTO') return 'QUOTE';
    if (t === 'OVERRIDE') return 'OVERRIDE';
    return 'MISSING';
  }

  priceLabel(productoId: string): string {
    const st = this.priceStatus(productoId);
    if (st === 'QUOTE') return 'Precio disponible (cotizacion)';
    if (st === 'OVERRIDE') return 'Precio manual (override)';
    return 'Sin precio — ejecuta Calcular o ingresa override';
  }

  priceValue(productoId: string): string | null {
    const c = this.calc();
    if (!c?.items?.length) return null;
    const found = c.items.find((x: any) => x.productoId === productoId);
    if (!found?.precioUnitario) return null;
    return this.formatPrecio(found.precioUnitario);
  }

  canonicalMeasures = computed(() => {
    const allowed = new Set(['KG', 'L', 'UND']);
    return (this.measures() ?? []).filter((m: any) => allowed.has(m?.key));
  });

  selectedMeasureKey = computed(() => {
    const m = this.canonicalMeasures().find((x: any) => x.idUnidadMedida === this.selectedMeasureId());
    return (m as any)?.key ?? '';
  });

  selectedProveedorQuote = computed(() => {
    const qc = this.quoteCheck();
    const pid = this.selectedProveedorId();
    if (!qc?.available || !pid) return null;
    return qc.quotes.find(q => q.proveedorId === pid) ?? null;
  });

  resetAddForm() {
    this.prodQ.set('');
    this.selectedProductId.set('');
    this.selectedMeasureId.set('');
    this.selectedProveedorId.set('');
    this.qty.set('1');
    this.addError.set('');
    this.quoteCheck.set(null);
  }

  resetOverrides() {
    this.overrideMap.set({});
    this.calc.set(null);
    this.calcError.set('');
  }

  removeItem(itemId: string) {
    const r = this.recipe();
    if (!r) return;
    this.removeError.set('');
    this.removingItemId.set(itemId);
    this.api.removeItem(r.idReceta, itemId).subscribe({
      next: () => {
        const it = (r.items ?? []).find((x: any) => x.idRecetaItem === itemId);
        if (it?.productoId) {
          const m = { ...this.overrideMap() };
          delete m[it.productoId];
          this.overrideMap.set(m);
        }
        this.calc.set(null);
        this.calcError.set('');
        this.api.getRecipe(r.idReceta).subscribe({ next: (rr) => this.recipe.set(rr), error: () => { } });
      },
      error: (e) => this.removeError.set(e?.error?.message ?? 'No se pudo eliminar el ingrediente.'),
      complete: () => this.removingItemId.set(null),
    });
  }

  formatQuotes(quotes: { proveedorNombre: string; precioUnidad: string }[], unitKey: string): string {
    return quotes
      .map(q => q.proveedorNombre + ' — ' + this.formatPrecio(q.precioUnidad) + '/' + unitKey)
      .join(' · ');
  }

  formatPrecio(value: string | number): string {
    const n = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(n)) return String(value);
    return n.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }
}
