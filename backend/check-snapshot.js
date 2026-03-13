const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const olla = await prisma.ollaPedido.findFirst({
    include: { items: true },
    orderBy: { idOllaPedido: 'desc' }
  });
  
  if (olla && olla.items.length > 0) {
    fs.writeFileSync('/tmp/snapshot.json', JSON.stringify(olla.items[0].snapshot, null, 2));
    console.log("Snapshot wriiten to /tmp/snapshot.json");
  } else {
    console.log("No ollas found");
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
