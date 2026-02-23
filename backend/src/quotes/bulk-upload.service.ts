import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { BulkUploadRowDto, BulkUploadResultDto } from './dto/bulk-upload.dto';

@Injectable()
export class BulkUploadService {
    constructor(private prisma: PrismaService) { }

    /**
     * Process bulk upload of quotations
     * THIS IS A COMPLEX METHOD - Validates, creates entities, and creates quotations
     */
    async processBulkUpload(
        rows: BulkUploadRowDto[],
        userId: bigint,
    ): Promise<BulkUploadResultDto> {
        const result: BulkUploadResultDto = {
            processed: rows.length,
            success: 0,
            failed: 0,
            created: {
                providers: 0,
                products: 0,
                categories: 0,
                quotations: 0,
            },
            errors: [],
        };

        // Cache for created/found entities to minimize DB queries
        const unitsCache = new Map<string, bigint>();
        const providersCache = new Map<string, bigint>();
        const categoriesCache = new Map<string, bigint>();
        const productsCache = new Map<string, bigint>();

        // Pre-load all units for validation
        const allUnits = await this.prisma.unidadMedida.findMany({
            where: { activo: true },
            select: { idUnidadMedida: true, key: true },
        });
        allUnits.forEach((u) => unitsCache.set(u.key.toLowerCase(), u.idUnidadMedida));

        // Process each row
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const rowNumber = i + 2; // Excel row number (1-indexed + header)

            try {
                // STEP 1: Validate required fields
                if (!row.nitProveedor?.trim()) {
                    result.errors.push({
                        row: rowNumber,
                        field: 'nitProveedor',
                        value: row.nitProveedor,
                        message: 'NIT Proveedor es requerido',
                    });
                    result.failed++;
                    continue;
                }

                if (!row.nombreProveedor?.trim()) {
                    result.errors.push({
                        row: rowNumber,
                        field: 'nombreProveedor',
                        value: row.nombreProveedor,
                        message: 'Nombre Proveedor es requerido',
                    });
                    result.failed++;
                    continue;
                }

                if (!row.nombreProducto?.trim()) {
                    result.errors.push({
                        row: rowNumber,
                        field: 'nombreProducto',
                        value: row.nombreProducto,
                        message: 'Nombre Producto es requerido',
                    });
                    result.failed++;
                    continue;
                }

                // STEP 2: Detect format (new vs legacy) and validate unit
                const isNewFormat = !!(row.precioUnidad && row.unidadReceta);
                const isLegacyFormat = !!(row.precioUnitario && row.cantidad && row.unidad);

                if (!isNewFormat && !isLegacyFormat) {
                    result.errors.push({
                        row: rowNumber,
                        field: 'general',
                        value: null,
                        message: 'Formato inválido. Use nuevo formato (precioUnidad + unidadReceta) o formato legacy (precioUnitario + cantidad + unidad)',
                    });
                    result.failed++;
                    continue;
                }

                let unitKey: string;
                const ACCEPTED_UNITS = ['KG', 'L', 'UND'];

                if (isNewFormat) {
                    // NEW FORMAT: validate unidadReceta
                    if (!row.unidadReceta?.trim()) {
                        result.errors.push({
                            row: rowNumber,
                            field: 'unidadReceta',
                            value: row.unidadReceta,
                            message: 'unidadReceta es requerida en formato nuevo',
                        });
                        result.failed++;
                        continue;
                    }
                    unitKey = row.unidadReceta.trim().toUpperCase();
                } else {
                    // LEGACY FORMAT: validate unidad
                    if (!row.unidad?.trim()) {
                        result.errors.push({
                            row: rowNumber,
                            field: 'unidad',
                            value: row.unidad,
                            message: 'Unidad es requerida',
                        });
                        result.failed++;
                        continue;
                    }
                    unitKey = row.unidad.trim().toUpperCase();
                }

                if (!ACCEPTED_UNITS.includes(unitKey)) {
                    result.errors.push({
                        row: rowNumber,
                        field: isNewFormat ? 'unidadReceta' : 'unidad',
                        value: isNewFormat ? row.unidadReceta : row.unidad,
                        message: `La unidad '${unitKey}' no es válida. Solo se aceptan: KG, L, UND`,
                    });
                    result.failed++;
                    continue;
                }

                // Find the unit ID from cache (case-insensitive)
                let unidadId = unitsCache.get(unitKey.toLowerCase());
                if (!unidadId) {
                    result.errors.push({
                        row: rowNumber,
                        field: isNewFormat ? 'unidadReceta' : 'unidad',
                        value: unitKey,
                        message: `La unidad '${unitKey}' no está configurada en el sistema. Contacte al administrador.`,
                    });
                    result.failed++;
                    continue;
                }

                // STEP 3: Validate and parse price based on format
                let precioUnidadNormalizado: Prisma.Decimal;
                let precioUnitarioLegacy: Prisma.Decimal;
                let cantidadLegacy: Prisma.Decimal;
                let precioPresentacionValue: Prisma.Decimal | null = null;

                if (isNewFormat) {
                    // NEW FORMAT: Can have precioUnidad OR precioPresentacion + cantidad

                    if (row.precioPresentacion && row.cantidad) {
                        // Option 1: User provides presentation price and quantity
                        // Example: precioPresentacion = 25000 (1 Arroba), cantidad = 25 (lb)
                        const precioPresent = this.parseDecimal(row.precioPresentacion);
                        if (!precioPresent || precioPresent.lte('0')) {
                            result.errors.push({
                                row: rowNumber,
                                field: 'precioPresentacion',
                                value: row.precioPresentacion,
                                message: 'precioPresentacion debe ser un número mayor a 0',
                            });
                            result.failed++;
                            continue;
                        }

                        const cantidad = this.parseDecimal(row.cantidad);
                        if (!cantidad || cantidad.lte('0')) {
                            result.errors.push({
                                row: rowNumber,
                                field: 'cantidad',
                                value: row.cantidad,
                                message: 'Cantidad debe ser un número mayor a 0',
                            });
                            result.failed++;
                            continue;
                        }

                        // Calculate normalized price: precioPresentacion / cantidad
                        precioUnidadNormalizado = precioPresent.div(cantidad);
                        precioPresentacionValue = precioPresent;
                        precioUnitarioLegacy = precioPresent;
                        cantidadLegacy = cantidad;

                    } else if (row.precioUnidad) {
                        // Option 2: User provides already normalized price
                        const precio = this.parseDecimal(row.precioUnidad);
                        if (!precio || precio.lte('0')) {
                            result.errors.push({
                                row: rowNumber,
                                field: 'precioUnidad',
                                value: row.precioUnidad,
                                message: 'precioUnidad debe ser un número mayor a 0',
                            });
                            result.failed++;
                            continue;
                        }
                        precioUnidadNormalizado = precio;
                        precioUnitarioLegacy = precio;
                        cantidadLegacy = new Prisma.Decimal('1');

                    } else {
                        result.errors.push({
                            row: rowNumber,
                            field: 'precioUnidad',
                            value: null,
                            message: 'Debe proporcionar precioUnidad O (precioPresentacion + cantidad)',
                        });
                        result.failed++;
                        continue;
                    }
                } else {
                    // LEGACY FORMAT: calculate normalized price
                    const precio = this.parseDecimal(row.precioUnitario);
                    if (!precio || precio.lte('0')) {
                        result.errors.push({
                            row: rowNumber,
                            field: 'precioUnitario',
                            value: row.precioUnitario,
                            message: 'Precio Unitario debe ser un número mayor a 0',
                        });
                        result.failed++;
                        continue;
                    }

                    const cantidad = this.parseDecimal(row.cantidad);
                    if (!cantidad || cantidad.lte('0')) {
                        result.errors.push({
                            row: rowNumber,
                            field: 'cantidad',
                            value: row.cantidad,
                            message: 'Cantidad debe ser un número mayor a 0',
                        });
                        result.failed++;
                        continue;
                    }

                    // Calculate normalized price: precioUnitario / cantidad
                    precioUnidadNormalizado = precio.div(cantidad);
                    precioUnitarioLegacy = precio;
                    cantidadLegacy = cantidad;
                }

                // STEP 4: Validate and parse date
                const fecha = this.parseDate(row.fecha);
                if (!fecha) {
                    result.errors.push({
                        row: rowNumber,
                        field: 'fecha',
                        value: row.fecha,
                        message: 'Fecha inválida. Use formato DD/MM/YYYY',
                    });
                    result.failed++;
                    continue;
                }

                // STEP 6: Find or create Provider
                const nit = row.nitProveedor.trim();
                let proveedorId = providersCache.get(nit);

                if (!proveedorId) {
                    const existing = await this.prisma.proveedor.findUnique({
                        where: { nit },
                        select: { idProveedor: true },
                    });

                    if (existing) {
                        proveedorId = existing.idProveedor;
                    } else {
                        // Create new provider
                        const newProvider = await this.prisma.proveedor.create({
                            data: {
                                nit,
                                nombre: row.nombreProveedor.trim(),
                                activo: true,
                                createdById: userId,
                            },
                            select: { idProveedor: true },
                        });
                        proveedorId = newProvider.idProveedor;
                        result.created.providers++;
                    }

                    providersCache.set(nit, proveedorId);
                }

                // STEP 7: Find or create Category (if provided)
                let categoriaId: bigint | undefined;
                if (row.categoriaProducto?.trim()) {
                    const catName = row.categoriaProducto.trim();
                    const catKey = catName.toLowerCase();

                    categoriaId = categoriesCache.get(catKey);

                    if (!categoriaId) {
                        const existingCat = await this.prisma.categoria.findFirst({
                            where: {
                                nombre: {
                                    equals: catName,
                                    mode: 'insensitive',
                                },
                            },
                            select: { idCategoria: true },
                        });

                        if (existingCat) {
                            categoriaId = existingCat.idCategoria;
                        } else {
                            // Create new category
                            const newCat = await this.prisma.categoria.create({
                                data: {
                                    nombre: catName,
                                    activo: true,
                                },
                                select: { idCategoria: true },
                            });
                            categoriaId = newCat.idCategoria;
                            result.created.categories++;
                        }

                        categoriesCache.set(catKey, categoriaId);
                    }
                }

                // STEP 8: Find or create Product
                const prodName = row.nombreProducto.trim();
                const prodKey = prodName.toLowerCase();
                let productoId = productsCache.get(prodKey);

                if (!productoId) {
                    const existingProd = await this.prisma.producto.findFirst({
                        where: {
                            nombre: {
                                equals: prodName,
                                mode: 'insensitive',
                            },
                        },
                        select: { idProducto: true, categoriaId: true },
                    });

                    if (existingProd) {
                        productoId = existingProd.idProducto;

                        // Update category if provided and different from current
                        if (categoriaId && categoriaId !== existingProd.categoriaId) {
                            await this.prisma.producto.update({
                                where: { idProducto: productoId },
                                data: { categoriaId },
                            });
                        }
                    } else {
                        // Create new product
                        const newProd = await this.prisma.producto.create({
                            data: {
                                nombre: prodName,
                                activo: true,
                                createdById: userId,
                                categoriaId: categoriaId || null,
                            },
                            select: { idProducto: true },
                        });
                        productoId = newProd.idProducto;
                        result.created.products++;
                    }

                    productsCache.set(prodKey, productoId);
                }

                // STEP 9: Create Quotation with new fields (vars are set in STEP 3 or we continued)
                await this.prisma.cotizacion.create({
                    data: {
                        proveedorId,
                        productoId,
                        unidadId,
                        // NEW FIELDS
                        precioUnidad: precioUnidadNormalizado!,
                        presentacionCompra: row.presentacionOriginal?.trim() || null,
                        precioPresentacion: precioPresentacionValue,
                        metadata: row.presentacionOriginal ? {
                            presentacionOriginal: row.presentacionOriginal,
                            formato: isNewFormat ? 'nuevo' : 'legacy',
                        } : undefined,
                        // LEGACY FIELDS (for backward compatibility)
                        precioUnitario: precioUnitarioLegacy!,
                        cantidad: cantidadLegacy!,
                        fecha,
                        observacion: row.observacion?.trim() || null,
                        activo: true,
                        createdById: userId,
                    },
                });

                result.created.quotations++;
                result.success++;
            } catch (error) {
                // Unexpected error for this row
                result.errors.push({
                    row: rowNumber,
                    field: 'general',
                    value: null,
                    message: `Error inesperado: ${error.message}`,
                });
                result.failed++;
            }
        }

        return result;
    }

    /**
     * Parse decimal from string or number, handling comma/dot separators
     */
    private parseDecimal(value: string | number | undefined): Prisma.Decimal | null {
        if (value === undefined || value === null || value === '') return null;

        try {
            // Convert to string and replace comma with dot
            const str = String(value).trim().replace(',', '.');
            return new Prisma.Decimal(str);
        } catch {
            return null;
        }
    }

    /**
     * Parse date from DD/MM/YYYY or YYYY-MM-DD format
     */
    private parseDate(value: string | undefined): Date | null {
        if (!value?.trim()) return null;

        const str = value.trim();

        // Try DD/MM/YYYY format
        const ddmmyyyyMatch = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        if (ddmmyyyyMatch) {
            const [, day, month, year] = ddmmyyyyMatch;
            const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            if (isNaN(date.getTime())) return null;
            return date;
        }

        // Try YYYY-MM-DD format
        const date = new Date(str);
        if (isNaN(date.getTime())) return null;
        return date;
    }
}
