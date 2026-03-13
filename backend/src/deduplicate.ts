import { PrismaClient, Proveedor } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- FUSIONANDO PROVEEDORES DUPLICADOS ---');
    const proveedores = await prisma.proveedor.findMany({
        orderBy: { idProveedor: 'asc' }
    });

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

    // Merge logic
    let mergedCount = 0;

    // Combina las agrupaciones
    const allGroups = [...Object.values(nitGroups), ...Object.values(nameGroups)];
    const processedGroups = new Set<string>();

    for (const group of allGroups) {
        if (group.length > 1) {
            // Sort to keep the oldest (smallest ID)
            group.sort((a, b) => Number(a.idProveedor) - Number(b.idProveedor));
            const keep = group[0];
            const duplicates = group.slice(1);

            for (const dup of duplicates) {
                if (processedGroups.has(dup.idProveedor.toString())) continue;
                processedGroups.add(dup.idProveedor.toString());

                console.log(`Fusionando proveedor ID ${dup.idProveedor} hacia ID ${keep.idProveedor}...`);

                // 1. Update Cotizacion
                await prisma.cotizacion.updateMany({
                    where: { proveedorId: dup.idProveedor },
                    data: { proveedorId: keep.idProveedor }
                });

                // 2. Update Factura
                try {
                    await prisma.factura.updateMany({
                        where: { proveedorId: dup.idProveedor },
                        data: { proveedorId: keep.idProveedor }
                    });
                } catch (e: any) {
                    console.warn(`No se pudieron mover facturas del prov ${dup.idProveedor}: ${e.message}`);
                }

                // 3. Update RecetaItem
                await prisma.recetaItem.updateMany({
                    where: { proveedorId: dup.idProveedor },
                    data: { proveedorId: keep.idProveedor }
                });

                // 4. Delete the duplicate
                await prisma.proveedor.delete({
                    where: { idProveedor: dup.idProveedor }
                });

                mergedCount++;
                console.log(`- Proveedor ${dup.idProveedor} eliminado con éxito.`);
            }
        }
    }
    console.log(`\nProceso completado. ${mergedCount} proveedores duplicados eliminados.`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
