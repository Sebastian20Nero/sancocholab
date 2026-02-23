const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateCategoryColors() {
    try {
        const colorMap = {
            'Postres': '#8B5CF6',        // Morado (Purple)
            'Platos Fuertes': '#10B981', // Verde (Green)
            'Entradas': '#EC4899',       // Rosa (Pink)
            'Bebidas': '#EF4444',        // Rojo (Red)
            'Ensaladas': '#F59E0B',      // Naranja (Amber) - mantenido
        };

        console.log('🎨 Updating category colors...\n');

        for (const [nombre, color] of Object.entries(colorMap)) {
            const result = await prisma.categoriaReceta.updateMany({
                where: { nombre },
                data: { color }
            });

            if (result.count > 0) {
                console.log(`  ✅ Updated "${nombre}" to ${color}`);
            } else {
                console.log(`  ⚠️  Category "${nombre}" not found`);
            }
        }

        console.log('\n📋 Current categories:');
        const categories = await prisma.categoriaReceta.findMany();
        categories.forEach(cat => {
            console.log(`  - ${cat.nombre}: ${cat.color}`);
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

updateCategoryColors();
