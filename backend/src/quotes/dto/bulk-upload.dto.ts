export interface BulkUploadRowDto {
    // Provider fields
    nitProveedor: string;
    nombreProveedor: string;

    // Product fields
    nombreProducto: string;
    categoriaProducto?: string;

    // NEW: Presentation from PDF (e.g., "1 Arroba", "Bulto x 50")
    presentacionOriginal?: string;

    // NEW: Price of the presentation (e.g., $25,000 for 1 Arroba)
    precioPresentacion?: string | number;

    // NEW: Normalized unit price (price per 1 KG, 1 L, 1 UND, or 1 GR)
    precioUnidad?: string | number;

    // NEW: Unit for recipe (KG, L, UND, GR)
    unidadReceta?: string;

    // LEGACY: Kept for backward compatibility
    precioUnitario?: string | number;
    cantidad?: string | number;
    unidad?: string;

    // Common fields
    fecha: string;
    observacion?: string;
}

export interface BulkUploadResultDto {
    processed: number;
    success: number;
    failed: number;
    created: {
        providers: number;
        products: number;
        categories: number;
        quotations: number;
    };
    errors: Array<{
        row: number;
        field: string;
        value: any;
        message: string;
    }>;
}
