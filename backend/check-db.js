const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const ollas = await prisma.ollaPedido.findMany({
    include: { items: true }
  });
  console.log("Total Ollas:", ollas.length);
  console.log(JSON.stringify(ollas, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
