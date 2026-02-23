const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkCategories() {
    try {
        const count = await prisma.categoriaReceta.count();
        console.log(`📊 Total categories in database: ${count}`);

        if (count > 0) {
            const categories = await prisma.categoriaReceta.findMany();
            console.log('\n📋 All categories:');
            categories.forEach(cat => {
                console.log(`  - ${cat.nombre} (color: ${cat.color}, activo: ${cat.activo})`);
            });
        } else {
            console.log('\n⚠️  No categories found. Creating sample categories...');

            const sampleCategories = [
                { nombre: 'Entradas', color: '#3B82F6' },      // Blue
                { nombre: 'Platos Fuertes', color: '#EF4444' }, // Red
                { nombre: 'Postres', color: '#F59E0B' },        // Amber
                { nombre: 'Bebidas', color: '#10B981' },        // Green
                { nombre: 'Ensaladas', color: '#8B5CF6' },      // Purple
            ];

            for (const cat of sampleCategories) {
                await prisma.categoriaReceta.create({ data: cat });
                console.log(`  ✅ Created: ${cat.nombre} (${cat.color})`);
            }

            console.log('\n✅ Sample categories created successfully!');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

checkCategories();
