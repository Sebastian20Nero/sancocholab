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

@Component({ standalone: true, imports: [CommonModule, DatePipe], templateUrl: './ollas-page.html' })
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
  historialSearch = signal(''); // Nuevo filtro de busqueda por nombre
  historialLoading = signal(false);
  historialFrom = signal(new Date().toISOString().slice(0, 8) + '01'); // Por defecto desde el 1 del mes
  historialTo = signal('');
  detalleAbierto = signal<string | null>(null);
  detalleLoading = signal(false);
  detalleActual = signal<any | null>(null);

  // ─── Renombrar Olla ───
  editandoNombreId = signal<string | null>(null);
  editandoNombreValor = signal('');

  // Computed filter
  filteredHistorial = computed(() => {
    const s = this.historialSearch().trim().toLowerCase();
    const data = this.historial();
    if (!s) return data;
    return data.filter(h => h.nombre?.toLowerCase().includes(s));
  });

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
        const m = e?.error?.message;
        const msg = Array.isArray(m) ? m.join(', ') : (m ?? 'Error al guardar la olla.');
        this.errorGuardar.set(msg);
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
      error: () => this.historialLoading.set(false),
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

  eliminarPedido(id: string, event: Event) {
    event.stopPropagation();
    if (!confirm('¿Estás seguro de que deseas eliminar esta olla del historial? (Sus datos de cotización permanecerán intactos).')) return;
    
    this.ollasApi.deletePedido(id).subscribe({
      next: () => {
        alert('🗑️ Olla inactivada del historial');
        this.loadHistorial();
      },
      error: (e) => alert('Error: no se pudo eliminar la olla. ' + (e?.error?.message ?? '')),
    });
  }

  // ─── Renombrar Olla ───
  iniciarEdicionNombre(id: string, nombreActual: string, event: Event) {
    event.stopPropagation();
    this.editandoNombreId.set(id);
    this.editandoNombreValor.set(nombreActual);
  }

  cancelarEdicionNombre(event: Event) {
    event.stopPropagation();
    this.editandoNombreId.set(null);
    this.editandoNombreValor.set('');
  }

  guardarNuevoNombre(id: string, event: Event) {
    event.stopPropagation();
    const nuevoNombre = this.editandoNombreValor().trim();
    if (!nuevoNombre) { alert('El nombre no puede estar vacío.'); return; }

    this.ollasApi.updatePedidoNombre(id, nuevoNombre).subscribe({
      next: () => {
        // Actualizar directamente en la lista local sin recargar
        this.historial.update(items =>
          items.map(h => h.idOllaPedido === id ? { ...h, nombre: nuevoNombre } : h)
        );
        this.editandoNombreId.set(null);
        this.editandoNombreValor.set('');
      },
      error: (e) => {
        const m = e?.error?.message;
        const msg = Array.isArray(m) ? m.join(', ') : (m ?? 'Error al renombrar la olla.');
        alert(msg);
      },
    });
  }

  formatPrecio(v: string | null | number): string {
    if (v === null || v === undefined) return '-';
    const n = typeof v === 'string' ? parseFloat(v) : v;
    if (isNaN(n)) return String(v);
    return n.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }
}
