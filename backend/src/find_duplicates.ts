import { PrismaClient, Proveedor, Producto } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- BUSCANDO PROVEEDORES DUPLICADOS ---');
    // Buscar duplicados por NIT (limpiando espacios) o por Nombre
    const proveedores = await prisma.proveedor.findMany();

    const nitGroups: Record<string, Proveedor[]> = {};
    const nameGroups: Record<string, Proveedor[]> = {};

    for (const p of proveedores) {
        const cleanNit = p.nit.replace(/\s+/g, '');
        if (!nitGroups[cleanNit]) nitGroups[cleanNit] = [];
        nitGroups[cleanNit].push(p);

        const cleanName = p.nombre.trim().toLowerCase();
        if (!nameGroups[cleanName]) nameGroups[cleanName] = [];
        nameGroups[cleanName].push(p);
    }

    let dupProvCount = 0;
    for (const [key, group] of Object.entries(nitGroups)) {
        if (group.length > 1) {
            console.log(`NIT duplicado: ${key} (${group.length} veces) - IDs: ${group.map((g: Proveedor) => g.idProveedor).join(', ')}`);
            dupProvCount++;
        }
    }
    for (const [key, group] of Object.entries(nameGroups)) {
        if (group.length > 1) {
            console.log(`Nombre duplicado: ${key} (${group.length} veces) - IDs: ${group.map((g: Proveedor) => g.idProveedor).join(', ')}`);
            dupProvCount++;
        }
    }
    if (dupProvCount === 0) console.log('No se encontraron proveedores duplicados.');

    console.log('\n--- BUSCANDO PRODUCTOS DUPLICADOS ---');
    const productos = await prisma.producto.findMany();

    const prodNameGroups: Record<string, Producto[]> = {};

    for (const p of productos) {
        const cleanName = p.nombre.trim().toLowerCase();
        if (!prodNameGroups[cleanName]) prodNameGroups[cleanName] = [];
        prodNameGroups[cleanName].push(p);
    }

    let dupProdCount = 0;
    for (const [key, group] of Object.entries(prodNameGroups)) {
        if (group.length > 1) {
            console.log(`Producto duplicado: ${key} (${group.length} veces) - IDs: ${group.map((g: Producto) => g.idProducto).join(', ')}`);
            dupProdCount++;
        }
    }
    if (dupProdCount === 0) console.log('No se encontraron productos duplicados.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
