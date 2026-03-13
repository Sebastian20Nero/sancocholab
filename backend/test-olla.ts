import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkReceta() {
  // Grab any recent quotation that was used as 'AUTO' to test.
  // Actually, let's just grab the latest OllaPedido and see what was stored in its snapshot.
  const latestPedido = await prisma.ollaPedido.findFirst({
    orderBy: { createdAt: 'desc' },
    include: {
      items: true
    }
  });

  if (!latestPedido) {
    console.log("No Olla pedidos found.");
    return;
  }

  console.log(`Latest Olla Pedido: ${latestPedido.nombre}`);
  
  if (latestPedido.items.length > 0) {
    const firstItem = latestPedido.items[0];
    const snap = firstItem.snapshot as any;
    if (snap && snap.items) {
      console.log("Snapshot Items sample:");
      console.log(JSON.stringify(snap.items.slice(0, 3), null, 2));
    } else {
      console.log("No snapshot items found.");
    }
  } else {
    console.log("No items in order.");
  }

  await prisma.$disconnect();
}

checkReceta().catch(e => console.error(e));
