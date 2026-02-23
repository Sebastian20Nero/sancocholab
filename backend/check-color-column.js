const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkColorColumn() {
    try {
        // Query to check if color column exists
        const result = await prisma.$queryRaw`
      SELECT column_name, data_type, column_default 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = 'CategoriaReceta' 
      ORDER BY ordinal_position;
    `;

        console.log('📋 Columns in CategoriaReceta table:');
        console.log(JSON.stringify(result, null, 2));

        const hasColorColumn = result.some(col => col.column_name === 'color');

        if (hasColorColumn) {
            console.log('\n✅ Color column EXISTS in database!');

            // Try to fetch a category to see if color is returned
            const categories = await prisma.categoriaReceta.findMany({ take: 1 });
            console.log('\n📦 Sample category data:');
            console.log(JSON.stringify(categories, null, 2));
        } else {
            console.log('\n❌ Color column DOES NOT exist in database!');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

checkColorColumn();
