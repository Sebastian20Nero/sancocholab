export interface Quotation {
    idCotizacion: string;
    fecha: Date | string;
    precioUnitario: string;
    cantidad: string;
    activo: boolean;
    proveedorId: string;
    proveedorNombre: string | null;
    productoId: string;
    productoNombre: string | null;
    categoriaId?: string | null;
    categoriaNombre?: string | null;
    unidadId: string;
    unidadKey: string | null;
    unidadNombre: string | null;
}
