const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function check() {
  const users = await prisma.user.findMany({ where: { email: { startsWith: 'tg_' } } });
  console.log("Found TG Users:", users);
}
check().catch(console.error).finally(() => prisma.$disconnect());
