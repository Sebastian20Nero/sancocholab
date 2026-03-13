const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    const res = await prisma.ollaPedidoItem.findFirst({
      orderBy: { idOllaPedidoItem: 'desc' }
    });
    console.log("=== LATEST OLLA PEDIDO ITEM ===");
    console.log(JSON.stringify(res.snapshot, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

run();
